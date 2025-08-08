import { _decorator, Component, Node, SpriteFrame, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Cloud")
export class Cloud extends Component {
  @property([SpriteFrame])
  variants: SpriteFrame[] = [];

  @property(Number)
  currentIndex: number = 0;

  public setType(index: number) {
    this.currentIndex = index;
    this.updateSprite();
  }

  protected start(): void {
    this.updateSprite();
  }

  private updateSprite() {
    const sprite = this.getComponent(Sprite);

    if (
      !sprite ||
      this.currentIndex < 0 ||
      this.currentIndex >= this.variants.length
    ) {
      console.warn("Invalid sprite or index out of bounds");
      return;
    }

    sprite.spriteFrame = this.variants[this.currentIndex];
  }
}
