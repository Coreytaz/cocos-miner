import { _decorator, Enum } from "cc";

import { CurrencyNames } from "../../consts/CurrencyNames.const";

const { ccclass, property } = _decorator;

@ccclass("Currency")
export class Currency {
  private _value: number = 0;
  private _defaultValue: number;

  @property({ type: Enum(CurrencyNames) })
  id: CurrencyNames;

  @property({ type: Number, tooltip: "Maximum amount of the currency" })
  maxAmount: number = Number.MAX_SAFE_INTEGER;

  @property({ type: Number, tooltip: "Default value for the currency" })
  get defaultValue() {
    return this._defaultValue;
  }

  @property({ type: Number, tooltip: "Current amount of the currency" })
  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = Math.max(0, Math.min(value, this.maxAmount));
  }

  set defaultValue(value: number) {
    this._defaultValue = value;
    this.value = value;
  }
}
