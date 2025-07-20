import {
  _decorator,
  Button,
  Component,
  Enum,
  EventTouch,
  Label,
  Node,
  Slider,
} from "cc";
import { ClipNamesSFX } from "db://assets/script/consts/ClipNamesSFX.const";
import { AudioManager } from "db://assets/script/core/audio/AudioManager";
import { l10n, L10nLabel } from "db://localization-editor/l10n";
const { ccclass, property } = _decorator;

type DragCallback = (event: EventTouch) => void;
type SlideCallback = (slider: Slider) => void;

@ccclass("VolumChanger")
export class VolumChanger extends L10nLabel {
  @property(Node) titleNode: Node = null!;
  @property(Node) valueNode: Node = null!;
  @property(Slider) sliderNode: Slider = null!;
  @property({ type: Enum(ClipNamesSFX) })
  clipNameSFX: ClipNamesSFX = "click";

  private onSlideCallbacks: SlideCallback[] = [];
  private onBeginDragCallbacks: DragCallback[] = [];
  private onEndDragCallbacks: DragCallback[] = [];

  start() {
    this.initSubribeSlide();
    this.initSubribeDrag();
    this.initTitle();
  }

  private initTitle() {
    const text = l10n.t(this.key);

    if (!text)
      return console.warn(`Localization key not found: ${this.key}`);

    const label = this.titleNode.getComponent(Label);

    if (!label)
      return console.warn(
        `Label component not found on titleNode: ${this.titleNode.name}`
      );

    label.string = text;
  }

  private initSubribeDrag() {
    const handle = this.sliderNode.handle.getComponent(Button);

    if (handle) {
      handle.node.on(Node.EventType.TOUCH_START, this.onHandleGrab, this);
      handle.node.on(Node.EventType.TOUCH_END, this.onHandleRelease, this);
    }
  }

  private initSubribeSlide() {
    this.sliderNode.node.on("slide", this.onhandleSlide, this);
  }

  private onHandleGrab(event: EventTouch) {
    if (!this.isPlayClickSound()) this.playClickSound();
    this.onBeginDragCallbacks.forEach((cb) => cb(event));
  }

  private onHandleRelease(event: EventTouch) {
    if (this.isPlayClickSound()) this.stopClickSound();
    this.playClickSound();
    this.onEndDragCallbacks.forEach((cb) => cb(event));
  }

  private onhandleSlide(slider: Slider) {
    this.setValueText(slider.progress);
    this.onSlideCallbacks.forEach((cb) => cb(slider));
  }

  private setValueText(value: number) {
    const label = this.valueNode.getComponent(Label);
    if (label) {
      label.string = (value * 100).toFixed(0) + "%";
    }
  }

  private stopClickSound() {
    AudioManager.instance.audioChannelSFX.stopSound(this.clipNameSFX);
  }

  private isPlayClickSound() {
    return AudioManager.instance.audioChannelSFX.isPlaying(this.clipNameSFX);
  }

  private playClickSound() {
    AudioManager.instance.audioChannelSFX.playSound(this.clipNameSFX);
  }

  set progress(value: number) {
    this.sliderNode.progress = value;
    this.setValueText(value);
  }

  onSubribeSlide(callback: SlideCallback) {
    this.onSlideCallbacks.push(callback);
  }

  onBeginDrag(callback: DragCallback) {
    this.onBeginDragCallbacks.push(callback);
  }

  onEndDrag(callback: DragCallback) {
    this.onEndDragCallbacks.push(callback);
  }
}
