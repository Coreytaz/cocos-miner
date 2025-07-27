import { _decorator, AudioSource, Component, Enum, Node } from "cc";
import { defaultConfig } from "../../consts/Default.const";
import { Sound } from "./Sound";
import { LSConfig } from "../../consts/LSConfig.const";
import type { ClipNamesMusic } from "../../consts/ClipNamesMusic.const";
import type { ClipNamesSFX } from "../../consts/ClipNamesSFX.const";
const { ccclass, property } = _decorator;

interface AudioChannePlaySoundOptions {
  playLoop?: boolean;
  waitForEnd?: boolean;
}

@ccclass("AudioChannel")
export class AudioChannel extends Component {
  private _muted = false;
  private _volume = 0;
  private _soundsRecord: Record<string, Sound> = {};
  private _soundsSource: Record<string, AudioSource> = {};

  @property([Sound])
  sounds: Sound[] = [];

  @property({ type: Number, max: 1, min: 0 })
  defaultVolume: number = defaultConfig.audio.audioManager.volume;

  @property({
    type: Enum(LSConfig),
    tooltip: "Prefix for local storage keys for muted state",
  })
  storageKeyPrefixMuted: string;

  @property({
    type: Enum(LSConfig),
    tooltip: "Prefix for local storage keys for volum state",
  })
  storageKeyPrefixVolum: string;

  init() {
    this.loadVolume();
    this.loadMuted();
    this.initAllSounds();
  }

  stopAllSounds() {
    Object.keys(this._soundsSource).forEach((key) => {
      const source = this._soundsSource[key];
      if (source) source.stop();
    });
    this._soundsSource = {};
  }

  playSound(
    name: ClipNamesMusic | ClipNamesSFX,
    options?: AudioChannePlaySoundOptions
  ) {
    const sound = this._soundsRecord[name];

    if (!sound) {
      console.warn(`Sound with name "${name}" not found.`);
      return null;
    }

    if (this._muted) return null;

    let audioSource = this._soundsSource[name];

    if (!audioSource) {
      audioSource = this.node.addComponent(AudioSource);
      audioSource.clip = sound.clip;
      audioSource.volume = this._volume * sound.volume;
      audioSource.loop = options?.playLoop || sound.loop;
      this._soundsSource[name] = audioSource;
    }

    audioSource.play();

    if (options?.waitForEnd) {
      return new Promise<AudioSource>((resolve) => {
        audioSource.node.once("ended", () => {
          resolve(audioSource);
        });
      });
    }

    return Promise.resolve(audioSource);
  }

  isPlaying(name: ClipNamesMusic | ClipNamesSFX): boolean {
    const audioSource = this._soundsSource[name];

    if (!audioSource) {
      console.warn(`Sound with name "${name}" is not playing.`);
      return false;
    }

    return audioSource.playing || false;
  }

  stopSound(name: ClipNamesMusic | ClipNamesSFX) {
    const audioSource = this._soundsSource[name];

    if (!audioSource)
      return console.warn(`Sound with name "${name}" is not playing.`);

    audioSource.stop();
  }

  get volume() {
    return this._volume;
  }

  set setMuted(value: boolean) {
    localStorage.setItem(this.storageKeyPrefixMuted, value ? "1" : "0");
    this._muted = value;
    this.setVolumeSounds(value ? 0 : this._volume);
  }

  set volume(value: number) {
    this._volume = value;
    localStorage.setItem(this.storageKeyPrefixVolum, value.toString());
    this.setVolumeSounds(value);
  }

  private setVolumeSounds(value: number) {
    const keys = this.sounds.map((sound) => sound.clipName);

    keys.forEach((key) => {
      const sound = this._soundsSource[key] || this._soundsRecord[key];
      if (sound) {
        this.setVolumeSound(value, sound);
      } else {
        console.warn(`Sound with name "${key}" not found.`);
      }
    });
  }

  private setVolumeSound(value: number, source: Sound | AudioSource) {
    source.volume = this._volume * value;
  }

  private initAllSounds() {
    this._soundsRecord = {};
    this.sounds.forEach((sound) => {
      this._soundsRecord[sound.clipName] = sound;
      this.initSound(sound);
    });
  }

  private initSound(sound: Sound) {
    if (this._muted) return (sound.volume = 0);
    this.setVolumeSound(sound.volume, sound);
  }

  private loadVolume() {
    const volume = parseFloat(
      localStorage.getItem(this.storageKeyPrefixVolum) ??
        this.defaultVolume.toString()
    );
    this._volume = volume;
  }

  private loadMuted() {
    const saved = localStorage.getItem(this.storageKeyPrefixMuted);
    this._muted = saved === "1";
  }
}
