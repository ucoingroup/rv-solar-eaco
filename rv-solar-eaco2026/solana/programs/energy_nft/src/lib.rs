//! EnergyNFT 发电量 NFT 合约
//! 将绿电发电量铸为 NFT，用于证明和追溯

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use mpl_token_metadata::{self, state::Data};

declare_id!("EnftXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod energy_nft {
    use super::*;

    /// 铸造绿电 NFT
    pub fn mint_energy_nft(
        ctx: Context<MintEnergyNft>,
        energy_kwh: u64,
        charging_id: String,
        campsite_id: String,
        timestamp: i64,
        oracle_signature: [u8; 64],
        _bump: u8,
    ) -> Result<()> {
        // 验证预言机签名（简化版）
        require!(ctx.accounts.oracle.key() == ctx.accounts.metadata.authority, ErrorCode::Unauthorized);

        // 更新统计
        ctx.accounts.energy_stats.total_minted += 1;
        ctx.accounts.energy_stats.total_energy_kwh += energy_kwh;

        // 铸造 NFT
        token::mint_to(ctx.accounts.mint_energy_nft.to_accounts_mut(), ctx.accounts.mint_authority.to_accounts())?;

        // 创建元数据（简化）
        let data = Data {
            name: format!("Green Energy #{}", ctx.accounts.mint_authority.key()),
            symbol: "GE".to_string(),
            uri: format!("https://api.eaco.io/nft/{}", charging_id),
            seller_fee_basis_points: 0,
            creators: None,
        };

        emit!(EnergyNftMinted {
            mint: ctx.accounts.mint.key(),
            owner: ctx.accounts.owner.key(),
            energy_kwh,
            charging_id,
            campsite_id,
            timestamp,
        });

        Ok(())
    }

    /// 转移绿电 NFT
    pub fn transfer_nft(
        ctx: Context<TransferNft>,
        _bump: u8,
    ) -> Result<()> {
        token::transfer(ctx.accounts.token_transfer.to_accounts(), 1)?;
        
        emit!(EnergyNftTransferred {
            mint: ctx.accounts.mint.key(),
            from: ctx.accounts.from.key(),
            to: ctx.accounts.to.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// 获取用户 NFT 列表
    pub fn get_user_nfts(ctx: Context<GetUserNfts>) -> Result<Vec<Pubkey>> {
        // 简化实现：返回拥有的 NFT mint 列表
        Ok(vec![])
    }

    /// 燃烧 NFT（用于碳积分兑换）
    pub fn burn_nft(ctx: Context<BurnNft>, _bump: u8) -> Result<()> {
        token::burn(ctx.accounts.burn_authority.to_accounts(), 1)?;
        
        emit!(EnergyNftBurned {
            mint: ctx.accounts.mint.key(),
            owner: ctx.accounts.owner.key(),
            energy_kwh: ctx.accounts.energy_stats.total_energy_kwh,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintEnergyNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub metadata: Account<'info, EnergyMetadata>,
    #[account(mut)]
    pub energy_stats: Account<'info, EnergyStats>,
    #[account(signer)]
    pub oracle: AccountInfo<'info>,
    pub token_program: Account<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub from: AccountInfo<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
    pub token_transfer: Account<'info, TokenAccount>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct GetUserNfts<'info> {
    pub owner: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct BurnNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub burn_authority: AccountInfo<'info>,
    #[account(mut)]
    pub energy_stats: Account<'info, EnergyStats>,
    pub token_program: Account<'info, Token>,
}

#[account]
pub struct EnergyMetadata {
    pub authority: Pubkey,
    pub mint_count: u64,
}

#[account]
pub struct EnergyStats {
    pub total_minted: u64,
    pub total_energy_kwh: u64,
    pub unique_holders: u64,
}

#[event]
pub struct EnergyNftMinted {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub energy_kwh: u64,
    pub charging_id: String,
    pub campsite_id: String,
    pub timestamp: i64,
}

#[event]
pub struct EnergyNftTransferred {
    pub mint: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct EnergyNftBurned {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub energy_kwh: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("无权限操作")]
    Unauthorized,
    #[msg("签名验证失败")]
    InvalidSignature,
    #[msg("铸造失败")]
    MintFailed,
    #[msg("余额不足")]
    InsufficientBalance,
}