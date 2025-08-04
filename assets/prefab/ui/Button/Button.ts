import {
  _decorator,
  EventHandler,
  Node,
  Button as ButtonCocos,
  Enum,
  Label,
} from "cc";
import { ClipNamesSFX } from "db://assets/script/consts/ClipNamesSFX.const";
import { AudioManager } from "db://assets/script/core/audio/AudioManager";
import { l10n, L10nLabel } from "db://localization-editor/l10n";

declare module "cc" {
  namespace __private {
    export enum _cocos_ui_button__ButtonEventType {
      /**
       * @event click
       * @param {Event.EventCustom} event
       * @param {Button} button - The Button component.
       */
      CLICK_AFTER_SOUND = "click:after-sound",
    }
  }
}

Object.defineProperty(ButtonCocos.EventType, "CLICK_AFTER_SOUND", {
  value: "click:after-sound",
  writable: false,
  enumerable: true,
  configurable: false,
});

const { ccclass, property } = _decorator;

@ccclass("Button")
export class Button extends L10nLabel {
  @property(Node)
  labelNode: Node = null!;

  @property({ type: Enum(ClipNamesSFX) })
  clipNameSFX: ClipNamesSFX = "click";

  onLoad() {
    this.initTextLabel();
    this.patchNativeClickEvent();
  }

  private initTextLabel() {
    const text = l10n.t(this.key);
    if (!text) {
      console.warn(`Localization key not found: ${this.key}`);
      return;
    }

    if (!this.labelNode) {
      console.warn("Label node is not assigned.");
      return;
    }

    const label = this.labelNode.getComponent(Label);

    if (!label) {
      console.warn(
        `Label component not found on labelNode: ${this.labelNode.name}`
      );
      return;
    }

    label.string = text;
  }

  private patchNativeClickEvent() {
    const button = this.getComponent(ButtonCocos);
    if (!button) return;

    this.node.off(ButtonCocos.EventType.CLICK, this.__proxyClick.bind(this));
    this.node.on(ButtonCocos.EventType.CLICK, this.__proxyClick.bind(this));
  }

  private async __proxyClick(event: Event) {
    await this.playClickSound();
    this.node.emit(ButtonCocos.EventType.CLICK_AFTER_SOUND, event);
  }

  private async playClickSound() {
    if (!this.isAudioManagerInitialized()) return null;

    const audioSource = await AudioManager.instance.audioChannelSFX.playSound(
      this.clipNameSFX,
      {
        waitForEnd: true,
      }
    );

    return audioSource;
  }

  private isAudioManagerInitialized(): boolean {
    return (
      AudioManager.isInstanceInitialized() &&
      AudioManager.instance.isAudioChannelSFXInitialized()
    );
  }
}
