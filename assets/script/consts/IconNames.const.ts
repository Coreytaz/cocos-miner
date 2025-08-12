export const IconNames = {
  arrowLeft: "arrow-left",
} as const;

export type IconNames = (typeof IconNames)[keyof typeof IconNames];
