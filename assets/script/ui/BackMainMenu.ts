import { _decorator, Button, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackMainMenu")
export class BackMainMenu extends Component {
  @property(Button)
  backButton: Button = null!;

  onLoad() {
    this.backButton.node.on("click", this.onBackButtonClick, this);
  }

  onBackButtonClick() {
    director.loadScene("MenuScene");
  }
}
