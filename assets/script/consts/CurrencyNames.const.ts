export const CurrencyNames = {
  cobblestone: "cobblestone",
  diamond: "diamond",
  gold: "gold",
  iron: "iron",
  netherite: "netherite",
  emerald: "emerald",
} as const;

export type CurrencyNames = (typeof CurrencyNames)[keyof typeof CurrencyNames];
