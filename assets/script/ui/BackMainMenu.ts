import { _decorator, Button, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackMainMenu")
export class BackMainMenu extends Component {
  @property(Button)
  backButton: Button = null!;

  onLoad() {
    this.backButton.node.on(Button.EventType.CLICK_AFTER_SOUND, this.onBackButtonClick, this);
  }

  onBackButtonClick() {
    director.loadScene("MenuScene");
  }
}
