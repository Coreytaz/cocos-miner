export const MenuState = {
  MENU: "MENU",
  PLAY: "PLAY",
  SETTINGS: "SETTINGS",
  STATS: "STATS",
} as const;

export type MenuState = (typeof MenuState)[keyof typeof MenuState];

let state: MenuState = MenuState.MENU;
const listeners: Record<string, (s: MenuState) => void> = {};

export function getMenuState(): MenuState {
  return state;
}

export function setMenuState(newState: MenuState) {
  state = newState;
  Object.keys(listeners).forEach((key) => listeners[key](newState));
}

export function onMenuStateChange(
  callback: (s: MenuState) => void,
  key: string = crypto.randomUUID()
) {
  listeners[key] = callback;
}

export function onRemoveMenuStateChange(key: string) {
  if (listeners[key]) {
    delete listeners[key];
  } else {
    console.warn(`No listener found for key: ${key}`);
  }
}
