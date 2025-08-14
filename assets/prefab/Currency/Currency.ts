import {
  _decorator,
  Component,
  Node,
  Enum,
  SpriteFrame,
  resources,
  ImageAsset,
  Texture2D,
  Sprite,
  Label,
} from "cc";

import { CurrencyNames } from "../../script/consts/CurrencyNames.const";
import { formatNumber } from "../../script/libs/formatNumber";

const { ccclass, property } = _decorator;

@ccclass("Currency")
export class Currency extends Component {
  @property({ type: Enum(CurrencyNames) })
  id: string;

  @property({ type: Enum(CurrencyNames) })
  iconName: CurrencyNames = "" as CurrencyNames;

  @property(Node)
  iconNode: Node = null!;

  @property(Node)
  valueLabel: Node = null!;

  set value(value: number) {
    this.setValueLabel(value);
  }

  protected start(): void {
    this.initIcon();
  }

  private setValueLabel(value: number) {
    if (!this.valueLabel) {
      console.warn("Value label node is not assigned.");
      return;
    }

    const labelComponent = this.valueLabel.getComponent(Label);

    if (!labelComponent) {
      console.warn(
        `Label component not found on valueLabel: ${this.valueLabel.name}`
      );
      return;
    }

    labelComponent.string = formatNumber(value);
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
        `currency/${this.iconName}`,
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
  }
}
