import { _decorator, Component, Node } from "cc";
import { VolumChanger } from "../../prefab/ui/VolumChanger/VolumChanger";
import { AudioChannel } from "../core/audio/AudioChannel";
const { ccclass, property } = _decorator;

@ccclass("VolumeSettings")
export class VolumeSettings extends Component {
  @property(Node) musicSliderNode: Node = null!;
  @property(Node) sfxSliderNode: Node = null!;

  @property(AudioChannel) AudioChannelMusic: AudioChannel = null!;
  @property(AudioChannel) AudioChannelSFX: AudioChannel = null!;

  start() {
    this.initVolume(this.AudioChannelMusic, this.musicSliderNode);
    this.onSubribeVolume(this.AudioChannelMusic, this.musicSliderNode);

    this.initVolume(this.AudioChannelSFX, this.sfxSliderNode);
    this.onSubribeVolume(this.AudioChannelSFX, this.sfxSliderNode);
  }

  initVolume(manager: AudioChannel, sliderNode: Node) {
    const musicVolume = manager.volume;
    const volumChanger = this.getVolumeChange(sliderNode);
    volumChanger.progress = musicVolume;
  }

  onSubribeVolume(manager: AudioChannel, sliderNode: Node) {
    const volumChanger = this.getVolumeChange(sliderNode);
    volumChanger.onSubribeSlide((event) => {
      const newVolume = event.progress;
      this.onChangeVolume(manager, newVolume);
    });
  }

  onChangeVolume(manager: AudioChannel, newVolume: number) {
    manager.volume = newVolume;
  }

  private getVolumeChange(sliderNode: Node) {
    return sliderNode.getComponent(VolumChanger);
  }
}
