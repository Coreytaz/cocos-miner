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
import { UIOpacity } from "cc";
import { Vec3 } from "cc";
import { tween } from "cc";

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
    this.playValueChangeAnimation();
  }

  private playValueChangeAnimation() {
    const labelNode = this.valueLabel;

    // Добавляем UIOpacity, если его нет
    if (!labelNode.getComponent(UIOpacity)) {
      labelNode.addComponent(UIOpacity);
    }

    // Сбрасываем параметры перед анимацией
    labelNode.setScale(new Vec3(1, 1, 1));
    labelNode.getComponent(UIOpacity)!.opacity = 255;

    // Анимация увеличения масштаба и мигания
    tween(labelNode)
      .to(0.1, { scale: new Vec3(1.05, 1.05, 1.05) })
      .to(0.1, { scale: new Vec3(1, 1, 1) })
      .start();

    tween(labelNode.getComponent(UIOpacity)!)
      .to(0.05, { opacity: 150 })
      .to(0.05, { opacity: 255 })
      .start();
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
