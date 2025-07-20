export const ClipNamesMusic = {
  mainTheme: "main-theme",
} as const;

export type ClipNamesMusic = (typeof ClipNamesMusic)[keyof typeof ClipNamesMusic];
