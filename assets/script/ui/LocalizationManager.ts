import { _decorator, Component, Enum, sys, Node, Button } from "cc";
import { DEV } from "cc/env";

import { l10n } from "db://localization-editor/l10n";

import { LSConfig } from "../consts/LSConfig.const";

import { LocalizationButton } from "../../prefab/ui/LocalizationButton/LocalizationButton";

const { ccclass, property } = _decorator;

@ccclass("LocalizationManager")
export class LocalizationManager extends Component {
  private _currentLanguage: string = null!;
  private _recordNode: Record<string, Node> = {};

  @property({
    type: Enum(LSConfig),
  })
  storageKeyLocalization: LSConfig = "localization";

  @property([Node])
  nodePickerLanguages: Node[] = [];

  start() {
    this.initCurrentLocalization();
    this.initUICurrentLanguages();
    this.initHandlers();
  }

  private initHandlers() {
    this.nodePickerLanguages.forEach((node) => {
      node.on(Button.EventType.CLICK_AFTER_SOUND, () =>
        this.onClickButton(node.name)
      );
    });
  }

  private onClickButton(name: string) {
    if (this._currentLanguage === name) return;

    const previousNode = this._recordNode[this._currentLanguage];

    if (previousNode) this.toggleLanguage(previousNode, false);

    this._currentLanguage = name;

    const currentNode = this._recordNode[name];

    if (!currentNode) {
      console.warn(`LocalizationManager: Node for language  not found.`, name);
      return;
    }

    this.toggleLanguage(currentNode, true);

    if (!(l10n.checkLanguage(name)?.length > 0)) {
      console.warn(
        `LocalizationManager: Language "${name}" not found in localization data.`
      );
    }

    l10n.changeLanguage(name);
  }

  private initUICurrentLanguage(node: Node) {
    this._recordNode[node.name] = node;
    if (node.name === this._currentLanguage) {
      this.toggleLanguage(node, true);
    }
  }

  private initUICurrentLanguages() {
    this.nodePickerLanguages.forEach(this.initUICurrentLanguage.bind(this));
  }

  private toggleLanguage(node: Node, value: boolean) {
    const localizationButton = node.getComponent(LocalizationButton);

    if (!localizationButton) return;

    localizationButton.active = value;
  }

  private initCurrentLocalization() {
    this._currentLanguage = l10n.currentLanguage;
  }
}
