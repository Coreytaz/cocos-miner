import { _decorator, AudioClip, Component, Enum } from "cc";
import { defaultConfig } from "../../consts/Default.const";
import { ClipNamesMusic } from "../../consts/ClipNamesMusic.const";
import { ClipNamesSFX } from "../../consts/ClipNamesSFX.const";
const { ccclass, property } = _decorator;

const mergeClipNamesMusic = {
  ...ClipNamesMusic,
  ...ClipNamesSFX,
};

const {
  loop: defaultLoop,
  // muted: defaultMuted,
  volume: defaultVolume,
} = defaultConfig.audio.default;

@ccclass("Sound")
export class Sound extends Component {
  @property({ type: AudioClip, tooltip: "Источник звука" })
  clip: AudioClip = null!;

  @property({ type: Enum(mergeClipNamesMusic), tooltip: "Название источника" })
  clipName: ClipNamesMusic | ClipNamesSFX = "" as ClipNamesMusic;

  @property({ tooltip: "Громкость (0–1)", type: Number, max: 1, min: 0 })
  volume: number = defaultVolume;

  @property({ tooltip: "Зациклен ли звук", type: Boolean })
  loop: boolean = defaultLoop;
}
