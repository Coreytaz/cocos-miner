/**
 * Number Formatter Utility
 * Formats numbers with compact notation (1K, 1M, etc.), localization and custom suffixes
 */

type FormatNumberOptions = {
  /** 
   * Locale for formatting (default: 'en-US') 
   * @example 'ru-RU' for Russian formatting
   */
  locale?: string;
  
  /** 
   * Number of decimal places (default: 1) 
   */
  decimals?: number;
  
  /** 
   * Whether to use compact notation (default: true) 
   * If false, will use full number with separators
   */
  compact?: boolean;
  
  /** 
   * Custom suffixes for compact notation
   * @default ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
   */
  suffixes?: string[];
  
  /**
   * Whether to force display of decimals even when .0
   * @default false
   */
  forceDecimals?: boolean;
};

/**
 * Formats a number with compact notation and localization support
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted number as string
 * 
 * @example
 * formatNumber(1500); // "1.5K"
 * formatNumber(1500, { locale: 'ru-RU' }); // "1,5K"
 * formatNumber(1500, { compact: false }); // "1,500"
 * formatNumber(1_500_000, { suffixes: ['', 'K', 'M'] }); // "1.5M"
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  // Destructure options with defaults
  const {
    locale = 'en-US',
    decimals = 1,
    compact = true,
    suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
    forceDecimals = false
  } = options;

  // Handle invalid numbers
  if (!Number.isFinite(value)) {
    return String(value); // Returns "Infinity", "NaN" etc.
  }

  // Handle negative numbers
  if (value < 0) {
    return '-' + formatNumber(Math.abs(value), options);
  }

  // Non-compact formatting (full number with separators)
  if (!compact || Math.abs(value) < 1000) {
    return value.toLocaleString(locale, {
      maximumFractionDigits: forceDecimals ? decimals : 0,
      minimumFractionDigits: forceDecimals ? decimals : 0
    });
  }

  // Determine the appropriate suffix tier
  const tier = Math.min(
    Math.floor(Math.log10(value) / 3),
    suffixes.length - 1
  );

  // Calculate the scaled value
  const scaledValue = value / Math.pow(1000, tier);
  const suffix = suffixes[tier];

  // Format the number with locale-aware decimal separators
  const formattedValue = scaledValue.toLocaleString(locale, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: forceDecimals ? decimals : 0
  });

  return formattedValue + suffix;
}