/**
 * Currency Formatting Utility for FoxPrice (Ugandan Shillings - UGX)
 */
export function formatUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatUGXCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `UGX ${(amount / 1_000).toFixed(0)}K`;
  }
  return `UGX ${amount.toLocaleString('en-US')}`;
}
