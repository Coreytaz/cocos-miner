import { MenuState } from "../store/MenuStateStore";

export const mapMenuState: Record<
  MenuState,
  {
    type: "scene" | "node";
    value: string;
  }
> = {
  [MenuState.PLAY]: {
    type: "scene",
    value: "GameScene",
  },
  [MenuState.STATS]: {
    type: "node",
    value: "Stats",
  },
  [MenuState.SETTINGS]: {
    type: "node",
    value: "Settings",
  },
  [MenuState.MENU]: {
    type: "node",
    value: "Main",
  },
};
