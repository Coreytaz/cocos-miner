import { _decorator, Component, Enum, SpriteFrame, Sprite, Node } from "cc";

import { LocalizationLanguage } from "../../../script/consts/LocalizationLanguage.const";

const { ccclass, property } = _decorator;

@ccclass("LocalizationButton")
export class LocalizationButton extends Component {
  private _active: boolean = false;

  @property({ type: Enum(LocalizationLanguage), tooltip: "Название языка" })
  language: LocalizationLanguage = "" as LocalizationLanguage;

  @property(Node)
  imgNode: Node = null!;

  @property(Node)
  borderNode: Node = null!;

  @property(Node)
  checkNode: Node = null!;

  @property(SpriteFrame)
  sprite: SpriteFrame = null!;

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this.activeBorder(value);
    this.activeCheck(value);
    this._active = value;
  }

  private activeBorder(value: boolean): void {
    if (!this.borderNode)
      return console.warn(
        "LocalizationButton: Border node not found on the button."
      );

    this.borderNode.active = value;
  }

  private activeCheck(value: boolean): void {
    if (!this.checkNode)
      return console.warn(
        "LocalizationButton: Check node not found on the button."
      );
    this.checkNode.active = value;
  }

  private initSprite(): void {
    if (!this.imgNode)
      return console.warn(
        "LocalizationButton: Img component not found on the node."
      );

    const spriteComponent = this.imgNode.getComponent(Sprite);

    if (!spriteComponent)
      return console.warn("LocalizationButton: Sprite component not found.");

    if (!this.sprite) return;

    spriteComponent.spriteFrame = this.sprite;
  }

  protected start(): void {
    this.initSprite();
  }
}
