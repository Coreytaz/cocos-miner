import { _decorator, Component, Node } from "cc";
import { Currency as CurrencyUI } from "../../prefab/Currency/Currency";
import { CurrencyManager } from "../core/currency/CurrencyManager";
import { Currency } from "../core/currency/Currency";
const { ccclass, property } = _decorator;

@ccclass("CurencyUIManager")
export class CurencyUIManager extends Component {
  @property(Node)
  currencysManagerUINode: Node = null!;

  private _recordCurrencyNodes: Map<string, CurrencyUI> = new Map();

  protected start(): void {
    this.initUI();
    this.unSubscribeCurrencyUpdate();
    this.subscribeCurrencyUpdate();
  }

  initUI() {
    if (!this.currencysManagerUINode) {
      console.warn("CurrencyManagerNode is not assigned.");
      return;
    }

    const currencyManager =
      this.currencysManagerUINode.getComponentsInChildren(CurrencyUI);

    if (!currencyManager || currencyManager.length === 0) {
      console.warn("No Currency components found in CurrencyManagerNode.");
      return;
    }

    currencyManager.forEach((currency) => {
      if (!currency.id) {
        console.warn("Currency id is not assigned.");
        return;
      }
      if (this._recordCurrencyNodes.has(currency.id)) {
        console.warn(`Currency with id ${currency.id} already exists.`);
        return;
      }
      this._recordCurrencyNodes.set(currency.id, currency);
      currency.value = 0;
    });
  }

  subscribeCurrencyUpdate() {
    CurrencyManager.instance.node.on(
      CurrencyManager.EventType.CURRENCY_UPDATED,
      this.onCurrencyUpdated,
      this
    );
  }

  unSubscribeCurrencyUpdate() {
    CurrencyManager.instance.node.off(
      CurrencyManager.EventType.CURRENCY_UPDATED,
      this.onCurrencyUpdated,
      this
    );
  }

  onCurrencyUpdated(currencies: Map<Currency["id"], Currency>) {
    currencies.forEach((currency) => {
      const currencyUI = this._recordCurrencyNodes.get(currency.id);

      if (!currencyUI) {
        console.warn(`Currency UI for id ${currency.id} not found.`);
        return;
      }

      currencyUI.value = currency.value;
    });
  }
}
