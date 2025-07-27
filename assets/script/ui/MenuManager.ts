import { _decorator, Button, Component, director, error, log, Node } from "cc";
import {
  MenuState,
  onMenuStateChange,
  onRemoveMenuStateChange,
  setMenuState,
} from "../store/MenuStateStore";
import { mapMenuState } from "../consts/menuState.const";
import { AudioManager } from "../core/audio/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("MenuManager")
export class MenuManager extends Component {
  @property([Button])
  buttonPlay: Button[] = [];

  @property([Button])
  buttonStats: Button[] = [];

  @property([Button])
  buttonSettings: Button[] = [];

  @property([Button])
  buttonMenu: Button[] = [];

  @property([Node])
  sections: Node[] = [];

  @property(Node)
  defaultActiveSection: Node = null!;

  private activeSection: Node | null = null;

  onClickChangeMenuStateAddEventListeners(nodes: Button[], state: MenuState) {
    nodes.forEach((node) => {
      node.node.on(
        Button.EventType.CLICK_AFTER_SOUND,
        this.onClickButton.bind(this, state)
      );
    });
  }

  onAddEventListeners() {
    this.onClickChangeMenuStateAddEventListeners(
      this.buttonMenu,
      MenuState.MENU
    );

    this.onClickChangeMenuStateAddEventListeners(
      this.buttonPlay,
      MenuState.PLAY
    );

    this.onClickChangeMenuStateAddEventListeners(
      this.buttonStats,
      MenuState.STATS
    );

    this.onClickChangeMenuStateAddEventListeners(
      this.buttonSettings,
      MenuState.SETTINGS
    );

    AudioManager.instance.audioChannelMusic.playSound("main-theme", {
      playLoop: true,
    });
  }

  onClickButton(state: MenuState) {
    setMenuState(state);
  }

  mappingGameState(state: MenuState) {
    const menuState = mapMenuState[state];

    if (!menuState) {
      error(`No scene mapped for state: ${state}`);
      return;
    }

    const { type, value } = menuState;

    const handler = this.mapGameState[type];

    if (!handler) {
      error(`No handler for type: ${type}`);
      return;
    }

    handler(value);
  }

  mapGameState = {
    scene: this.onChangeScene.bind(this),
    node: this.onChangeNode.bind(this),
  };

  onChangeNode(nodeName: string) {
    const section = this.sections.find((section) => section.name === nodeName);

    if (!section) {
      error(`No section found with name: ${nodeName}`);
      return;
    }

    const oldActiveSection = this.activeSection;
    oldActiveSection.active = false;

    section.active = true;
    this.activeSection = section;
  }

  onChangeScene(sceneName: string) {
    console.log(`onChangeScene`);
    director.loadScene(sceneName);
  }

  onSubscribeToStore() {
    onMenuStateChange(this.mappingGameState.bind(this), this.uuid);
  }

  setActiveSection(section: Node) {
    section.active = true;
    this.activeSection = section;
  }

  protected onDestroy() {
    onRemoveMenuStateChange(this.uuid);
  }

  start() {
    log("MenuManager loaded");
    this.setActiveSection(this.defaultActiveSection);
    this.onSubscribeToStore();
    this.onAddEventListeners();
  }
}
