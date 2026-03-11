import { SoundConfig } from "@/common/sound";
import { getAssetUrl } from "./get-asset-url";
import i18n from "@/common/providers/i18n";

export const SoundEffects: SoundConfig[] = [
  {
    name: "cannon",
    path: getAssetUrl('/assets/audio/shoot/cannon.mp3'),
    volume: 0.1,
  },
  {
    name: "heavy-gun",
    path: getAssetUrl('/assets/audio/shoot/heavy-gun.mp3'),
    volume: 0.04,
    minInterval: 400,
    volumeVariation: 0.02,
  },
  {
    name: "rifle",
    path: getAssetUrl('/assets/audio/shoot/rifle.mp3'),
    volume: 0.06,
    minInterval: 600,
    volumeVariation: 0.02,
  },
  {
    name: "electric",
    path: getAssetUrl('/assets/audio/shoot/electric.wav'),
    volume: 0.35,
  },
  {
    name: "freeze",
    path: getAssetUrl('/assets/audio/shoot/freeze.wav'),
    volume: 0.05,
    minInterval: 400,
    volumeVariation: 0.02,
  },
  {
    name: "anti-air",
    path: getAssetUrl('/assets/audio/shoot/anti-air.wav'),
    volume: 0.06,
    minInterval: 600,
    volumeVariation: 0.02,
  },

  {
    name: "explosion-cannon",
    path: getAssetUrl('/assets/audio/explosion/cannon.mp3'),
    volume: 0.2,
  },
  {
    name: "explosion-anti-air",
    path: getAssetUrl('/assets/audio/explosion/anti-air.mp3'),
    volume: 0.2,
  },
  {
    name: "clinking-coin",
    path: getAssetUrl('/assets/audio/clinking-coin.wav'),
    volume: 0.1,
    volumeVariation: 0.02,
    minInterval: 600,
  },
  {
    name: "place-tower",
    path: getAssetUrl('/assets/audio/place-tower.mp3'),
    volume: 0.15,
    volumeVariation: 0,
    pitchVariation: 0.015,
    minInterval: 150,
  },
];

export const getSoundVoices: () => SoundConfig[] = () => [
  {
    name: "gold_lack",
    path: getAssetUrl(`/assets/audio/voice/${i18n.lang} - gold lack.mp3`),
    volume: 0.4,
    minInterval: 0,
    maxInstances: 1,
    pitchVariation: 0,
    volumeVariation: 0,
  },
  {
    name: "upgrade_complete",
    path: getAssetUrl(`/assets/audio/voice/${i18n.lang} - on upgrade.mp3`),
    volume: 0.4,
    minInterval: 0,
    maxInstances: 1,
    pitchVariation: 0,
    volumeVariation: 0,
  },
  {
    name: "i_cant",
    path: getAssetUrl(`/assets/audio/voice/${i18n.lang} - i cant.mp3`),
    volume: 0.55,
    minInterval: 0,
    maxInstances: 1,
    pitchVariation: 0,
    volumeVariation: 0,
  },
];

export const MonsterEffects: SoundConfig[] = [
  {
    name: "bee-roar",
    path: getAssetUrl('/assets/audio/monsters/bee-roar.mp3'),
    volume: 0.15,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "goblin-roar",
    path: getAssetUrl('/assets/audio/monsters/goblin-roar.wav'),
    volume: 0.2,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "orc-roar",
    path: getAssetUrl('/assets/audio/monsters/orc-roar.wav'),
    volume: 0.2,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "orcLord-roar",
    path: getAssetUrl('/assets/audio/monsters/orcLord-roar.wav'),
    volume: 0.2,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "plant-roar",
    path: getAssetUrl('/assets/audio/monsters/plant-roar.mp3'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "plantZombie-roar",
    path: getAssetUrl('/assets/audio/monsters/plantZombie-roar.mp3'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "plantFire-roar",
    path: getAssetUrl('/assets/audio/monsters/plantFire-roar.mp3'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "slime-roar",
    path: getAssetUrl('/assets/audio/monsters/slime-roar.wav'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "slimeBoned-roar",
    path: getAssetUrl('/assets/audio/monsters/slimeBoned-roar.wav'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "slimeVulcan-roar",
    path: getAssetUrl('/assets/audio/monsters/slimeVulcan-roar.wav'),
    volume: 0.1,
    volumeVariation: 0.05,
    minInterval: 600,
  },
  {
    name: "wolf-roar",
    path: getAssetUrl('/assets/audio/monsters/wolf-roar.wav'),
    volume: 0.25,
    volumeVariation: 0.05,
    minInterval: 600,
  },
];

export const Musics: SoundConfig[] = [
  {
    name: "theme",
    path: getAssetUrl('/assets/audio/theme.mp3'),
    volume: 0.8,
    minInterval: 0,
    maxInstances: 1,
    pitchVariation: 0,
    volumeVariation: 0,
  },
];

export type MusicsName = "theme";

export type VoiceName = "gold_lack" | "upgrade_complete";

export type EffectName =
  | "cannon"
  | "heavy-gun"
  | "rifle"
  | "electric"
  | "freeze"
  | "anti-air"
  | "explosion-cannon"
  | "explosion-anti-air"
  | "place-tower";

export type MonsterEffectName =
  | "bee-walk"
  | "goblin-roar"
  | "goblin-walk"
  | "orc-roar"
  | "orc-walk"
  | "orcLord-roar"
  | "orcLord-walk"
  | "plant-walk"
  | "slime-roar"
  | "slime-walk"
  | "wolf-roar"
  | "wolf-walk";

export type SoundNames =
  | EffectName
  | VoiceName
  | MonsterEffectName
  | MusicsName;
