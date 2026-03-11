import { Assets } from "pixi.js";
import { actions, AssetsMap, directions, monsters } from "./assets";
import { RenderState } from "@/Game/Render/render";
import SoundLayer, { SoundConfig } from "@/common/sound";
import {
  MonsterEffects,
  SoundEffects,
  getSoundVoices,
} from "./sound-assets";
import { SoundGroups } from "@/common/enum/sound-groups";
import { getAssetUrl } from "./get-asset-url";

type ProgressCallback = (progress: number) => void;
type AssetDescriptor = { alias: string; src: string };

export async function loadAssets(onProgress?: ProgressCallback) {
  const SoundVoices = getSoundVoices();
  const visualAssets = collectVisualAssets();

  let loadedCount = 0;
  const reportProgress = () => {
    loadedCount++;
    onProgress?.(loadedCount / totalCount);
  };

  const totalCount =
    visualAssets.length +
    SoundEffects.length +
    SoundVoices.length +
    MonsterEffects.length;

  await Promise.all([
    ...visualAssets.map((asset) => loadVisualAsset(asset, reportProgress)),
    loadSoundAssets(reportProgress),
  ]);

  RenderState.shouldLoadAssets = false;
}

function collectVisualAssets(): AssetDescriptor[] {
  const assets: AssetDescriptor[] = [];

  for (const monster of monsters) {
    for (const direction of directions) {
      for (const action of actions) {
        const key = `${monster}-${direction.toLowerCase()}-${action.toLowerCase()}`;
        const src = getAssetUrl(`/assets/frames/monsters/${monster}/${direction}_${action}.webp`);
        AssetsMap[key as keyof typeof AssetsMap] = { alias: key, src };
      }
    }
  }

  for (const { alias, src } of Object.values(AssetsMap)) {
    assets.push({ alias, src });
  }

  assets.push(...createExplosionAssets("bullet_cannon", 10));
  assets.push(...createExplosionAssets("bullet_mg", 4));
  assets.push(...createExplosionAssets("electric", 5));
  assets.push(...createExplosionAssets("anti_air", 5));
  assets.push(...createMapAssets(5));

  return assets;
}

function createExplosionAssets(type: string, count: number): AssetDescriptor[] {
  return Array.from({ length: count }, (_, i) => ({
    alias: `explosion-${type}-${i + 1}`,
    src: getAssetUrl(`/assets/frames/explosion/${type}/Explosion_${i + 1}.webp`),
  }));
}

function createMapAssets(count: number): AssetDescriptor[] {
  return Array.from({ length: count }, (_, i) => ({
    alias: `map-${i + 1}`,
    src: getAssetUrl(`/assets/images/maps/Map_${i + 1}.png`),
  }));
}

async function loadVisualAsset(
  asset: AssetDescriptor,
  reportProgress: () => void
) {
  const finalSrc = await resolveAssetPath(asset.src);

  // @ts-expect-error: dynamic update of asset map
  if (AssetsMap[asset.alias]) AssetsMap[asset.alias].src = finalSrc;

  Assets.add({ alias: asset.alias, src: finalSrc });
  const texture = await Assets.load(asset.alias);

  if (texture.source.scaleMode) texture.source.scaleMode = "linear";

  reportProgress();
}

async function loadSoundAssets(reportProgress: () => void) {
  const SoundVoices = getSoundVoices();

  const voices = await loadSoundGroup(SoundVoices, reportProgress);
  const effects = await loadSoundGroup(SoundEffects, reportProgress);
  const monsters = await loadSoundGroup(MonsterEffects, reportProgress);

  await SoundLayer.loadGroup(SoundGroups.Voices, voices);
  await SoundLayer.loadGroup(SoundGroups.Effects, effects);
  await SoundLayer.loadGroup(SoundGroups.Monsters, monsters);
}

export async function loadSoundGroup(
  sounds: SoundConfig[],
  reportProgress: () => void
) {
  return Promise.all(
    sounds.map(async (sound) => {
      sound.path = await resolveAssetPath(sound.path);
      reportProgress();
      return sound;
    })
  );
}

/**
 * Resolve o path do asset (já servido junto da aplicação em public/assets).
 * IMPORTANTE: path deve vir apenas de config interna (assets, torres, mapas).
 * Nunca passar valor controlado pelo usuário ou dados não confiáveis do Firestore.
 */
async function resolveAssetPath(path: string): Promise<string> {
  if (typeof window === "undefined") return path;
  const lower = path.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    throw new Error("resolveAssetPath: disallowed scheme");
  }
  if (path.includes("..")) {
    throw new Error("resolveAssetPath: path traversal disallowed");
  }
  if (path.startsWith("http")) return path;
  return new URL(path, window.location.origin).href;
}
