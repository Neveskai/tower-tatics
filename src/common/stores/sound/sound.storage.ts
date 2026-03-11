import { Storage } from "@capacitor/storage";
import { SoundGroups } from '@/common/enum/sound-groups'

const MASTER_VOLUME_KEY = "sound_master_volume";
const GROUP_VOLUME_KEY_PREFIX = "sound_group_volume_";

export async function saveMasterVolume(volume: number) {
  await Storage.set({ key: MASTER_VOLUME_KEY, value: volume.toString() });
}

export async function loadMasterVolume(): Promise<number | null> {
  const { value } = await Storage.get({ key: MASTER_VOLUME_KEY });
  return value !== null ? parseFloat(value) : null;
}

export async function saveGroupVolume(group: SoundGroups, volume: number) {
  await Storage.set({
    key: GROUP_VOLUME_KEY_PREFIX + group,
    value: volume.toString(),
  });
}

export async function loadGroupVolume(group: SoundGroups): Promise<number | null> {
  const { value } = await Storage.get({ key: GROUP_VOLUME_KEY_PREFIX + group });

  return value !== null ? parseFloat(value) : null;
}
