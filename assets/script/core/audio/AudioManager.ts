import { _decorator, Component, Node } from "cc";
import { AudioChannel } from "./AudioChannel";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  @property(Node)
  audioMusicNode: Node = null!;

  @property(Node)
  audioSFXNode: Node = null!;

  audioChannelMusic: AudioChannel = null!;
  audioChannelSFX: AudioChannel = null!;

  private static _instance: AudioManager;

  static get instance(): AudioManager {
    return this._instance;
  }

  static isInstanceInitialized(): boolean {
    return !!this._instance;
  }

  onDisable(): void {
    this.audioChannelMusic.stopAllSounds();
    this.audioChannelSFX.stopAllSounds();
  }

  start() {
    AudioManager._instance = this;
    this.initAudioChannels();
  }

  isAudioChannelMusicInitialized(): boolean {
    return this.isAudioChannelInitialized(this.audioChannelMusic);
  }

  isAudioChannelSFXInitialized(): boolean {
    return this.isAudioChannelInitialized(this.audioChannelSFX);
  }

  private isAudioChannelInitialized(channel: AudioChannel): boolean {
    return channel && channel?.isValid && !!channel?.node;
  }

  initAudioChannels() {
    if (!this.audioMusicNode || !this.audioSFXNode) {
      console.error("AudioManager: Audio nodes are not set.");
      return;
    }

    this.audioChannelMusic = this.initAudioChannel(this.audioMusicNode);
    this.audioChannelSFX = this.initAudioChannel(this.audioSFXNode);
  }

  initAudioChannel(audioNode: Node) {
    const audioChannel = audioNode.getComponent(AudioChannel);

    if (audioChannel) {
      audioChannel.init();
    } else {
      console.error(
        "AudioManager: AudioChannel component not found on node:",
        audioNode.name
      );
    }
    return audioChannel;
  }
}
