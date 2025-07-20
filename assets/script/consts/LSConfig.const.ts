export const LSConfig = {
    BG_MUSIC_MUTED: "bgMusicMuted",
    BGM_MUSIC_VOLUME: "bgMusicVolume",
    BG_SFV_MUTED: "bgSvfMuted",
    BG_SFV_VOLUME: "bgSvfVolume",
} as const

export type LSConfig = (typeof LSConfig)[keyof typeof LSConfig];