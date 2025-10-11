/**
 * Platform Fee Configuration
 * Centralized configuration for all platform and payment processing fees
 */

export const PLATFORM_CONFIG = {
  /**
   * Platform fee percentage (7% of item price)
   */
  platformFeePercentage: 0.07,

  /**
   * Payment processing fee percentage (2.9%)
   * Standard Stripe rate for online transactions
   */
  paymentProcessingFeePercentage: 0.029,

  /**
   * Payment processing fixed fee in cents ($0.30)
   * Standard Stripe fixed fee per transaction
   */
  paymentProcessingFeeFixedCents: 30,
} as const;

/**
 * Calculate platform fee for a given amount
 * @param amountCents - The transaction amount in cents
 * @returns Platform fee in cents
 */
export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * PLATFORM_CONFIG.platformFeePercentage);
}

/**
 * Calculate payment processing fee (Stripe)
 * @param amountCents - The transaction amount in cents
 * @returns Payment processing fee in cents
 */
export function calculatePaymentProcessingFee(amountCents: number): number {
  return Math.round(
    amountCents * PLATFORM_CONFIG.paymentProcessingFeePercentage +
    PLATFORM_CONFIG.paymentProcessingFeeFixedCents
  );
}

/**
 * Calculate seller payout after all fees
 * @param itemPriceCents - Item price in cents
 * @param shippingCents - Shipping cost in cents (passed to seller)
 * @returns Object containing fee breakdown and seller payout
 */
export function calculateSellerPayout(
  itemPriceCents: number,
  shippingCents: number = 0
): {
  itemPriceCents: number;
  shippingCents: number;
  totalCents: number;
  platformFeeCents: number;
  paymentProcessingFeeCents: number;
  sellerPayoutCents: number;
} {
  const totalCents = itemPriceCents + shippingCents;
  const platformFeeCents = calculatePlatformFee(itemPriceCents);
  const paymentProcessingFeeCents = calculatePaymentProcessingFee(totalCents);
  const sellerPayoutCents = totalCents - platformFeeCents - paymentProcessingFeeCents;

  return {
    itemPriceCents,
    shippingCents,
    totalCents,
    platformFeeCents,
    paymentProcessingFeeCents,
    sellerPayoutCents,
  };
}

