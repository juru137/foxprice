/**
 * Formatting utilities for FoxPrice Marketplace (Uganda)
 */

export function formatUGX(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'UGX 0';
  }
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatShortUGX(amount: number): string {
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `UGX ${(amount / 1_000).toFixed(0)}K`;
  }
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}
