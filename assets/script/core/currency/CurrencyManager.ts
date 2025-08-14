import { _decorator, Component, Node } from "cc";

import { Currency } from "./Currency";

const { ccclass, property } = _decorator;

export enum CurrencyManagerEventType {
  CURRENCY_UPDATED = "currency_updated",
}

@ccclass("CurrencyManager")
export class CurrencyManager extends Component {
  @property([Currency])
  currencies: Currency[] = [];

  private static _instance: CurrencyManager;

  static get instance(): CurrencyManager {
    return this._instance;
  }

  static EventType: typeof CurrencyManagerEventType = CurrencyManagerEventType;

  private _currencyMap: Map<string, Currency> = new Map();

  private init() {
    this.currencies.forEach((currency) => {
      this._currencyMap.set(currency.id, currency);
    });
  }

  protected start() {
    CurrencyManager._instance = this;
    this.init();
  }

  private _addCurrency(currency: Currency, amount: number) {
    if (!currency) {
      console.warn(`Currency with id ${currency.id} does not exist.`);
      return;
    }

    currency.value += amount;
  }

  private _getCurrency(id: string): Currency | undefined {
    return this._currencyMap.get(id);
  }

  addCurrency(id: string, amount: number) {
    const currency = this._getCurrency(id);
    this._addCurrency(currency, amount);
    this._emitCurrencyUpdate();
    this.saveCurrencies();
  }

  private _emitCurrencyUpdate() {
    this.node.emit(CurrencyManager.EventType.CURRENCY_UPDATED, this.currencies);
  }

  private saveCurrencies() {
    // Сохранение в localStorage или на сервер
  }
}
