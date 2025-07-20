export const GameState = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  SHOP: "SHOP",
  GAME_OVER: "GAME_OVER",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

let state: GameState = GameState.MENU;
const listeners: ((s: GameState) => void)[] = [];

export function getGameState(): GameState {
  return state;
}

export function setGameState(newState: GameState) {
  state = newState;
  listeners.forEach((fn) => fn(newState));
}

export function onGameStateChange(callback: (s: GameState) => void) {
  listeners.push(callback);
}
