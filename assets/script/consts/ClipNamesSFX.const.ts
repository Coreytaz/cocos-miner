export const ClipNamesSFX = {
  click: "click",
} as const;

export type ClipNamesSFX = (typeof ClipNamesSFX)[keyof typeof ClipNamesSFX];
