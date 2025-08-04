export const LocalizationLanguage = {
  en: "en",
  ru: "ru",
} as const;

export type LocalizationLanguage =
  (typeof LocalizationLanguage)[keyof typeof LocalizationLanguage];
