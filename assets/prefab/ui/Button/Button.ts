import {
  _decorator,
  Component,
  EventHandler,
  Node,
  Button as ButtonCocos,
  Enum,
  Label,
} from "cc";
import { ClipNamesSFX } from "db://assets/script/consts/ClipNamesSFX.const";
import { AudioManager } from "db://assets/script/core/audio/AudioManager";
import { l10n, L10nLabel } from "db://localization-editor/l10n";
const { ccclass, property } = _decorator;

@ccclass("Button")
export class Button extends L10nLabel {
  @property(Node)
  labelNode: Node = null!;

  @property({ type: Enum(ClipNamesSFX) })
  clipNameSFX: ClipNamesSFX = "click";

  onLoad() {
    this.initTextLabel();
    this.initClickEventHandler("playSound");
  }

  initClickEventHandler(handler: string) {
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "Button";
    clickEventHandler.handler = handler;

    const button = this.node.getComponent(ButtonCocos);
    button.clickEvents.push(clickEventHandler);
  }

  initTextLabel() {
    const text = l10n.t(this.key);

    if (!text) return console.warn(`Localization key not found: ${this.key}`);

    const label = this.labelNode.getComponent(Label);

    if (!label)
      return console.warn(
        `Label component not found on titleNode: ${this.labelNode.name}`
      );

    label.string = text;
  }

  playSound() {
    if (this.isPlayClickSound()) this.stopClickSound();
    this.playClickSound();
  }

  private isAudioManagerInitialized(): boolean {
    if (!AudioManager.isInstanceInitialized()) return false;
    if (!AudioManager.instance.isAudioChannelSFXInitialized()) return false;
    return true;
  }

  private stopClickSound() {
    if (!this.isAudioManagerInitialized()) return;
    AudioManager.instance.audioChannelSFX.stopSound(this.clipNameSFX);
  }

  private isPlayClickSound() {
    if (!this.isAudioManagerInitialized()) return;
    return AudioManager.instance.audioChannelSFX.isPlaying(this.clipNameSFX);
  }

  private playClickSound() {
    if (!this.isAudioManagerInitialized()) return;
    AudioManager.instance.audioChannelSFX.playSound("click");
  }
}
