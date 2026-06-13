//! PaymentGateway 支付网关合约
//! 支持 EACO、USDT、USDC、SOL、wBNB 等多币种支付

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("PaygwXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod payment_gateway {
    use super::*;

    /// 创建支付订单
    pub fn create_payment(
        ctx: Context<CreatePayment>,
        amount_cents: u64,
        payment_token: Pubkey,
        order_id: String,
        _bump: u8,
    ) -> Result<()> {
        require!(amount_cents > 0, ErrorCode::InvalidAmount);

        let payment = &mut ctx.accounts.payment;
        payment.user = ctx.accounts.user.key();
        payment.amount_cents = amount_cents;
        payment.payment_token = payment_token;
        payment.order_id = order_id;
        payment.status = PaymentStatus::Pending;
        payment.created_at = Clock::get()?.unix_timestamp;
        payment.updated_at = Clock::get()?.unix_timestamp;
        payment.gateway_fee = (amount_cents as f64 * 0.004) as u64; // 0.4% 费率
        payment.bump = _bump;

        emit!(PaymentCreated {
            payment_id: ctx.accounts.payment.key(),
            user: ctx.accounts.user.key(),
            amount_cents,
            payment_token,
            timestamp: payment.created_at,
        });

        Ok(())
    }

    /// 完成支付（用户授权后调用）
    pub fn complete_payment(
        ctx: Context<CompletePayment>,
        _bump: u8,
    ) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        require!(payment.status == PaymentStatus::Pending, ErrorCode::PaymentNotPending);

        // 根据支付代币类型执行转账
        match payment.payment_token {
            EACO_TOKEN => {
                // EACO 转账
                let cpi_ctx = CpiContext::new(
                    ctx.accounts.token_program.key(),
                    token::Transfer {
                        from: ctx.accounts.user_token.to_account_info(),
                        to: ctx.accounts.merchant_token.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                );
                token::transfer(cpi_ctx, payment.amount_cents)?;
            }
            _ => {
                // 其他代币（USDT/USDC/SOL/wBNB）
                let cpi_ctx = CpiContext::new(
                    ctx.accounts.token_program.key(),
                    token::Transfer {
                        from: ctx.accounts.user_token.to_account_info(),
                        to: ctx.accounts.merchant_token.to_account_info(),
                        authority: ctx.accounts.user.to_account_info(),
                    },
                );
                token::transfer(cpi_ctx, payment.amount_cents)?;
            }
        }

        // 转账手续费
        if payment.gateway_fee > 0 {
            let fee_seeds = &[b"payment_gateway", &[_bump]];
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.key(),
                token::Transfer {
                    from: ctx.accounts.user_token.to_account_info(),
                    to: ctx.accounts.fee_treasury.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            );
            token::transfer(cpi_ctx.with_signer(&[&fee_seeds[..]]), payment.gateway_fee)?;
        }

        payment.status = PaymentStatus::Completed;
        payment.updated_at = Clock::get()?.unix_timestamp;

        emit!(PaymentCompleted {
            payment_id: ctx.accounts.payment.key(),
            user: ctx.accounts.user.key(),
            amount_cents: payment.amount_cents,
            timestamp: payment.updated_at,
        });

        Ok(())
    }

    /// 取消支付
    pub fn cancel_payment(ctx: Context<CancelPayment>, _bump: u8) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        require!(payment.status == PaymentStatus::Pending, ErrorCode::PaymentNotPending);
        require!(payment.user == ctx.accounts.user.key(), ErrorCode::Unauthorized);

        payment.status = PaymentStatus::Cancelled;
        payment.updated_at = Clock::get()?.unix_timestamp;

        emit!(PaymentCancelled {
            payment_id: ctx.accounts.payment.key(),
            user: ctx.accounts.user.key(),
            timestamp: payment.updated_at,
        });

        Ok(())
    }

    /// 退款
    pub fn refund_payment(ctx: Context<RefundPayment>, _bump: u8) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        require!(payment.status == PaymentStatus::Completed, ErrorCode::PaymentNotCompleted);
        require!(ctx.accounts.merchant.key() == ctx.accounts.merchant_token.owner, ErrorCode::Unauthorized);

        // 退款（简化版，直接转回用户）
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.key(),
            token::Transfer {
                from: ctx.accounts.merchant_token.to_account_info(),
                to: ctx.accounts.user_token.to_account_info(),
                authority: ctx.accounts.merchant.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, payment.amount_cents)?;

        payment.status = PaymentStatus::Refunded;
        payment.updated_at = Clock::get()?.unix_timestamp;

        emit!(PaymentRefunded {
            payment_id: ctx.accounts.payment.key(),
            user: ctx.accounts.user.key(),
            amount_cents: payment.amount_cents,
            timestamp: payment.updated_at,
        });

        Ok(())
    }

    /// 更新费率
    pub fn update_fee_rate(ctx: Context<UpdateFeeRate>, new_rate: u64) -> Result<()> {
        require!(ctx.accounts.admin.key() == ctx.accounts.config.admin, ErrorCode::Unauthorized);
        ctx.accounts.config.fee_rate = new_rate;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePayment<'info> {
    #[account(init, payer = user, space = 8 + 140)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CompletePayment<'info> {
    #[account(mut)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub merchant_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub fee_treasury: Account<'info, TokenAccount>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelPayment<'info> {
    #[account(mut)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RefundPayment<'info> {
    #[account(mut)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub merchant: AccountInfo<'info>,
    #[account(mut)]
    pub merchant_token: Account<'info, TokenAccount>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateFeeRate<'info> {
    #[account(mut)]
    pub config: Account<'info, GatewayConfig>,
    #[account(signer)]
    pub admin: AccountInfo<'info>,
}

#[account]
pub struct Payment {
    pub user: Pubkey,
    pub amount_cents: u64,
    pub payment_token: Pubkey,
    pub order_id: String,
    pub status: PaymentStatus,
    pub gateway_fee: u64,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

#[account]
pub struct GatewayConfig {
    pub admin: Pubkey,
    pub fee_rate: u64,      // 费率 (如 40 = 0.4%)
    pub fee_treasury: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum PaymentStatus {
    Pending,
    Completed,
    Cancelled,
    Refunded,
}

// 代币地址常量（需要替换为实际部署的合约地址）
pub const EACO_TOKEN: Pubkey = pubkey!("DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH");
pub const USDT_TOKEN: Pubkey = pubkey!("Esr8hKBRNuaCRnKMQJNws4Pp3qey6BcE4VmtH9gMsLqM");
pub const USDC_TOKEN: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8DN4sWqbFNtF1zXK");

#[event]
pub struct PaymentCreated {
    pub payment_id: Pubkey,
    pub user: Pubkey,
    pub amount_cents: u64,
    pub payment_token: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PaymentCompleted {
    pub payment_id: Pubkey,
    pub user: Pubkey,
    pub amount_cents: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentCancelled {
    pub payment_id: Pubkey,
    pub user: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PaymentRefunded {
    pub payment_id: Pubkey,
    pub user: Pubkey,
    pub amount_cents: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("无效金额")]
    InvalidAmount,
    #[msg("支付状态不是待支付")]
    PaymentNotPending,
    #[msg("支付状态不是已完成")]
    PaymentNotCompleted,
    #[msg("无权限")]
    Unauthorized,
    #[msg("代币余额不足")]
    InsufficientBalance,
}