/**
 * Utility functions for dual-currency display (USD & Venezuelan Bolívares Bs.)
 * Handles realistic dental equipment pricing stored in thousands (/1000)
 */

export function formatUSD(valueInThousands: number): string {
  const usdValue = (valueInThousands || 0) / 1000;
  return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
}

export function formatVES(valueInThousands: number, exchangeRate: number = 45): string {
  const usdValue = (valueInThousands || 0) / 1000;
  const rate = exchangeRate > 0 ? exchangeRate : 45;
  const vesValue = usdValue * rate;
  
  // Format with Venezuelan convention (punto para miles, coma para decimales)
  const formatted = vesValue.toLocaleString('de-DE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  return `Bs. ${formatted}`;
}

export function calculateVES(valueInThousands: number, exchangeRate: number = 45): number {
  const usdValue = (valueInThousands || 0) / 1000;
  const rate = exchangeRate > 0 ? exchangeRate : 45;
  return usdValue * rate;
}
