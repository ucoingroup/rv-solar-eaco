//! P2PMarket P2P 交易市场合约
//! 用于 EACO 代币的点对点交易

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("P2pmXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod p2p_market {
    use super::*;

    /// 创建挂单
    pub fn create_order(
        ctx: Context<CreateOrder>,
        side: OrderSide,
        price_cents: u64,
        quantity: u64,
        payment_token: Pubkey,
        _bump: u8,
    ) -> Result<()> {
        require!(quantity > 0, ErrorCode::InvalidQuantity);
        require!(price_cents > 0, ErrorCode::InvalidPrice);

        let order = &mut ctx.accounts.order;
        order.maker = ctx.accounts.maker.key();
        order.side = side;
        order.price_cents = price_cents;
        order.quantity = quantity;
        order.filled_quantity = 0;
        order.payment_token = payment_token;
        order.created_at = Clock::get()?.unix_timestamp;
        order.status = OrderStatus::Active;
        order.bump = _bump;

        // 锁定 Maker 的代币
        if side == OrderSide::Sell {
            // Sell 订单：锁定 EACO
            require!(
                ctx.accounts.maker_token.amount >= quantity,
                ErrorCode::InsufficientBalance
            );
        }

        emit!(OrderCreated {
            order_id: ctx.accounts.order.key(),
            maker: ctx.accounts.maker.key(),
            side: side as u8,
            price_cents,
            quantity,
            timestamp: order.created_at,
        });

        Ok(())
    }

    /// 成交订单
    pub fn fill_order(
        ctx: Context<FillOrder>,
        quantity: u64,
        _bump: u8,
    ) -> Result<()> {
        let order = &mut ctx.accounts.order;
        require!(order.status == OrderStatus::Active, ErrorCode::OrderNotActive);
        require!(
            order.filled_quantity + quantity <= order.quantity,
            ErrorCode::QuantityExceedsOrder
        );

        let fill_amount = order.price_cents
            .checked_mul(quantity)
            .unwrap();

        // 转账支付代币
        if order.side == OrderSide::Sell {
            // Sell 订单：Buyer 支付 USDC/USDT，买家获得 EACO
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.key(),
                token::Transfer {
                    from: ctx.accounts.buyer_payment.to_account_info(),
                    to: ctx.accounts.maker_payment.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            );
            token::transfer(cpi_ctx, fill_amount)?;

            // 转账 EACO
            let seeds = &[b"p2p_market", order.maker.as_ref(), &[_bump]];
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.key(),
                token::Transfer {
                    from: ctx.accounts.maker_token.to_account_info(),
                    to: ctx.accounts.buyer_token.to_account_info(),
                    authority: ctx.accounts.maker.to_account_info(),
                },
            );
            token::transfer(cpi_ctx.with_signer(&[&seeds[..]]), quantity)?;
        } else {
            // Buy 订单：Seller 收到 USDC/USDT
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.key(),
                token::Transfer {
                    from: ctx.accounts.buyer_token.to_account_info(),
                    to: ctx.accounts.maker_payment.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            );
            token::transfer(cpi_ctx, fill_amount)?;
        }

        order.filled_quantity += quantity;

        // 检查是否完全成交
        if order.filled_quantity == order.quantity {
            order.status = OrderStatus::Filled;
        }

        emit!(OrderFilled {
            order_id: ctx.accounts.order.key(),
            taker: ctx.accounts.buyer.key(),
            quantity,
            fill_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// 取消订单
    pub fn cancel_order(ctx: Context<CancelOrder>, _bump: u8) -> Result<()> {
        let order = &mut ctx.accounts.order;
        require!(order.status == OrderStatus::Active, ErrorCode::OrderNotActive);
        require!(order.maker == ctx.accounts.maker.key(), ErrorCode::Unauthorized);

        order.status = OrderStatus::Cancelled;

        emit!(OrderCancelled {
            order_id: ctx.accounts.order.key(),
            maker: ctx.accounts.maker.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// 批量创建订单
    pub fn create_order_batch(
        ctx: Context<CreateOrderBatch>,
        orders: Vec<OrderParams>,
        _bump: u8,
    ) -> Result<()> {
        for (i, params) in orders.iter().enumerate() {
            let order = &mut ctx.accounts.orders[i];
            order.maker = ctx.accounts.maker.key();
            order.side = params.side;
            order.price_cents = params.price_cents;
            order.quantity = params.quantity;
            order.filled_quantity = 0;
            order.payment_token = params.payment_token;
            order.created_at = Clock::get()?.unix_timestamp;
            order.status = OrderStatus::Active;
            order.bump = _bump;
        }

        emit!(BatchOrderCreated {
            maker: ctx.accounts.maker.key(),
            count: orders.len() as u64,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateOrder<'info> {
    #[account(init, payer = maker, space = 8 + 120)]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub maker: AccountInfo<'info>,
    #[account(mut)]
    pub maker_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub maker_payment: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Account<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FillOrder<'info> {
    #[account(mut)]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub maker: AccountInfo<'info>,
    #[account(mut)]
    pub maker_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub maker_payment: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer: AccountInfo<'info>,
    #[account(mut)]
    pub buyer_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_payment: Account<'info, TokenAccount>,
    pub token_program: Account<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub order: Account<'info, Order>,
    #[account(mut)]
    pub maker: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CreateOrderBatch<'info> {
    #[account(mut)]
    pub orders: Vec<Account<'info, Order>>,
    #[account(mut)]
    pub maker: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct OrderParams {
    pub side: OrderSide,
    pub price_cents: u64,
    pub quantity: u64,
    pub payment_token: Pubkey,
}

#[account]
pub struct Order {
    pub maker: Pubkey,
    pub side: OrderSide,
    pub price_cents: u64,
    pub quantity: u64,
    pub filled_quantity: u64,
    pub payment_token: Pubkey,
    pub created_at: i64,
    pub status: OrderStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum OrderSide {
    Sell,
    Buy,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum OrderStatus {
    Active,
    Filled,
    Cancelled,
}

#[event]
pub struct OrderCreated {
    pub order_id: Pubkey,
    pub maker: Pubkey,
    pub side: u8,
    pub price_cents: u64,
    pub quantity: u64,
    pub timestamp: i64,
}

#[event]
pub struct OrderFilled {
    pub order_id: Pubkey,
    pub taker: Pubkey,
    pub quantity: u64,
    pub fill_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct OrderCancelled {
    pub order_id: Pubkey,
    pub maker: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct BatchOrderCreated {
    pub maker: Pubkey,
    pub count: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("无效数量")]
    InvalidQuantity,
    #[msg("无效价格")]
    InvalidPrice,
    #[msg("余额不足")]
    InsufficientBalance,
    #[msg("订单已关闭")]
    OrderNotActive,
    #[msg("数量超出订单范围")]
    QuantityExceedsOrder,
    #[msg("无权限")]
    Unauthorized,
}