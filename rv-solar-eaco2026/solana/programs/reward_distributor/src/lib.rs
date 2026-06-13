//! RewardDistributor 奖励分发合约
//! 用于分发 EACO 代币作为绿电奖励

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("RwrdXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod reward_distributor {
    use super::*;

    /// 初始化奖励分发器
    pub fn initialize(ctx: Context<Initialize>, _bump: u8) -> Result<()> {
        let reward_distributor = &mut ctx.accounts.reward_distributor;
        reward_distributor.authority = ctx.accounts.authority.key();
        reward_distributor.treasury = ctx.accounts.treasury.key();
        reward_distributor.token_mint = ctx.accounts.token_mint.key();
        reward_distributor.reward_rate = 1000; // 1000 EACO per kWh
        reward_distributor.total_distributed = 0;
        reward_distributor.total_recipients = 0;
        reward_distributor.paused = false;
        Ok(())
    }

    /// 分发绿电奖励
    pub fn distribute_reward(
        ctx: Context<DistributeReward>,
        energy_kwh: u64,
        oracle_signature: [u8; 64],
        _bump: u8,
    ) -> Result<()> {
        // 验证签名（简化版，实际应验证预言机签名）
        require!(ctx.accounts.reward_distributor.paused == false, ErrorCode::Paused);
        
        let reward_amount = ctx.accounts.reward_distributor.reward_rate
            .checked_mul(energy_kwh)
            .unwrap();

        // 转账代币
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.key(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.recipient_token.to_account_info(),
                authority: ctx.accounts.treasury.to_account_info(),
            },
        );
        
        // 使用 PDA 签名
        let seeds = &[
            b"reward_distributor",
            &[_bump],
        ];
        let signer = &[&seeds[..]];
        token::transfer(cpi_ctx.with_signer(signer), reward_amount)?;

        // 更新统计
        ctx.accounts.reward_distributor.total_distributed += reward_amount;
        ctx.accounts.reward_distributor.total_recipients += 1;

        // 记录奖励事件
        emit!(RewardDistributed {
            recipient: ctx.accounts.recipient.key(),
            amount: reward_amount,
            energy_kwh,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// 批量分发奖励
    pub fn distribute_reward_batch(
        ctx: Context<DistributeRewardBatch>,
        rewards: Vec<RewardInfo>,
        oracle_signature: [u8; 64],
        _bump: u8,
    ) -> Result<()> {
        require!(ctx.accounts.reward_distributor.paused == false, ErrorCode::Paused);
        
        let total_amount: u64 = rewards.iter()
            .map(|r| {
                ctx.accounts.reward_distributor.reward_rate
                    .checked_mul(r.energy_kwh)
                    .unwrap()
            })
            .sum();

        // 转账总金额
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.key(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.reward_pool.to_account_info(),
                authority: ctx.accounts.treasury.to_account_info(),
            },
        );
        
        let seeds = &[b"reward_distributor", &[_bump]];
        token::transfer(cpi_ctx.with_signer(&[&seeds[..]]), total_amount)?;

        // 分发到各个接收者
        for reward in &rewards {
            let amount = ctx.accounts.reward_distributor.reward_rate
                .checked_mul(reward.energy_kwh)
                .unwrap();
            
            // 发放到用户账户
            let user_seeds = &[
                b"user_reward",
                &reward.recipient.as_ref(),
                &[reward.bump],
            ];
            
            // 更新奖励记录
            ctx.accounts.reward_records
                .iter_mut()
                .find(|r| r.recipient == reward.recipient)
                .map(|r| {
                    r.total_reward += amount;
                    r.total_energy_kwh += reward.energy_kwh;
                });
        }

        emit!(BatchRewardDistributed {
            batch_id: Clock::get()?.unix_timestamp,
            total_amount,
            recipients: rewards.len() as u64,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// 更新奖励率
    pub fn update_reward_rate(ctx: Context<UpdateConfig>, new_rate: u64) -> Result<()> {
        require!(ctx.accounts.reward_distributor.authority == ctx.accounts.signer.key(), ErrorCode::Unauthorized);
        ctx.accounts.reward_distributor.reward_rate = new_rate;
        Ok(())
    }

    /// 暂停/恢复
    pub fn set_paused(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> {
        require!(ctx.accounts.reward_distributor.authority == ctx.accounts.signer.key(), ErrorCode::Unauthorized);
        ctx.accounts.reward_distributor.paused = paused;
        Ok(())
    }

    /// 提取 SOL（用于合约维护）
    pub fn withdraw_sol(ctx: Context<WithdrawSol>, amount: u64) -> Result<()> {
        require!(ctx.accounts.reward_distributor.authority == ctx.accounts.signer.key(), ErrorCode::Unauthorized);
        
        **ctx.accounts.treasury.lamports.borrow_mut() -= amount;
        **ctx.accounts.recipient.lamports.borrow_mut() += amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 72)]
    pub reward_distributor: Account<'info, RewardDistributor>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Account<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DistributeReward<'info> {
    #[account(mut)]
    pub reward_distributor: Account<'info, RewardDistributor>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    #[account(mut)]
    pub recipient_token: Account<'info, TokenAccount>,
    #[account(signer)]
    pub oracle: AccountInfo<'info>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeRewardBatch<'info> {
    #[account(mut)]
    pub reward_distributor: Account<'info, RewardDistributor>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub reward_pool: Account<'info, TokenAccount>,
    #[account(signer)]
    pub oracle: AccountInfo<'info>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut)]
    pub reward_distributor: Account<'info, RewardDistributor>,
    #[account(signer)]
    pub signer: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(mut)]
    pub reward_distributor: Account<'info, RewardDistributor>,
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    #[account(signer)]
    pub signer: AccountInfo<'info>,
}

#[account]
pub struct RewardDistributor {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub token_mint: Pubkey,
    pub reward_rate: u64,      // 每 kWh 奖励数量
    pub total_distributed: u64,
    pub total_recipients: u64,
    pub paused: bool,
}

#[account]
pub struct RewardRecord {
    pub recipient: Pubkey,
    pub total_reward: u64,
    pub total_energy_kwh: u64,
    pub last_claim_time: i64,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct RewardInfo {
    pub recipient: Pubkey,
    pub energy_kwh: u64,
    pub bump: u8,
}

#[event]
pub struct RewardDistributed {
    pub recipient: Pubkey,
    pub amount: u64,
    pub energy_kwh: u64,
    pub timestamp: i64,
}

#[event]
pub struct BatchRewardDistributed {
    pub batch_id: i64,
    pub total_amount: u64,
    pub recipients: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("奖励分发器已暂停")]
    Paused,
    #[msg("无权限操作")]
    Unauthorized,
    #[msg("签名验证失败")]
    InvalidSignature,
    #[msg("金额超出范围")]
    AmountOverflow,
}