import {
  Texture2D,
  ImageAsset,
  SpriteFrame,
  resources,
  Sprite,
  _decorator,
  CCBoolean,
  Node,
  Button as ButtonCocos,
  Enum,
  Label,
} from "cc";
import { ClipNamesSFX } from "db://assets/script/consts/ClipNamesSFX.const";
import { IconNames } from "db://assets/script/consts/IconNames.const";
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

  @property(Node)
  iconNode: Node = null!;

  @property(SpriteFrame)
  defaultBG: SpriteFrame = null!;

  @property({ type: Enum(ClipNamesSFX) })
  clipNameSFX: ClipNamesSFX = "click";

  @property(CCBoolean)
  private isIcon: boolean = false;

  @property({
    type: Enum(IconNames),
    visible(this: Button) {
      return this.isIcon;
    },
  })
  iconName: IconNames = "" as IconNames;

  @property({
    type: SpriteFrame,
    visible(this: Button) {
      return this.isIcon;
    },
  })
  iconBG: SpriteFrame = null!;

  onLoad() {
    if (this.isIcon) {
      this.initBG(this.iconBG);
      this.initIcon();
    } else {
      this.initBG(this.defaultBG);
      this.initTextLabel();
    }

    this.patchNativeClickEvent();
  }

  private initBG(spriteFrame: SpriteFrame) {
    if (!spriteFrame) {
      console.warn("SpriteFrame for background is not assigned.");
      return;
    }

    const sprite = this.getComponent(Sprite);

    if (!sprite) {
      console.warn(`Sprite component not found on node: ${this.node.name}`);
      return;
    }

    sprite.spriteFrame = spriteFrame;
  }

  private async initIcon() {
    if (!this.iconName) {
      console.warn("Icon name is not assigned.");
      return;
    }

    if (!this.iconNode) {
      console.warn("Icon node is not assigned.");
      return;
    }

    const spriteFrame = await new Promise<SpriteFrame | null>((resolve) => {
      return resources.load(
        `icons/${this.iconName}`,
        ImageAsset,
        (err, imageAsset) => {
          if (err) {
            resolve(null);
          }

          const texture = new Texture2D();
          texture.image = imageAsset;

          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;

          resolve(spriteFrame);
        }
      );
    });

    if (!spriteFrame) {
      console.warn(`SpriteFrame not found for icon: ${this.iconName}`);
      return;
    }

    const iconSprite = this.iconNode.getComponent(Sprite);

    if (!iconSprite) {
      console.warn(
        `Sprite component not found on iconNode: ${this.iconNode.name}`
      );
      return;
    }

    iconSprite.spriteFrame = spriteFrame;

    this.iconNode.active = true;
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

    this.labelNode.active = true;
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
