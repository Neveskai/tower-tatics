import { useState } from "react";
import SoundLayer from "@/common/sound";
import { SoundGroups } from '@/common/enum/sound-groups'
import { setSyncFromLocal } from "@/common/stores/sync";

export const useVolumeControl = () => {
  const [volumes, setVolumes] = useState({
    general: SoundLayer.volume,
    musics: SoundLayer.getGroupVolume(SoundGroups.Musics),
    voices: SoundLayer.getGroupVolume(SoundGroups.Voices),
    effects: SoundLayer.getGroupVolume(SoundGroups.Effects),
    monsters: SoundLayer.getGroupVolume(SoundGroups.Monsters),
  });

  const updateGeneralVolume = (value: number) => {
    SoundLayer.setMasterVolume(value);

    setSyncFromLocal();

    setVolumes((v) => ({ ...v, general: value }));
  };

  const updateGroupVolume = (group: SoundGroups, value: number) => {
    SoundLayer.setGroupVolume(group, value);

    setSyncFromLocal();

    setVolumes((v) => ({ ...v, [group]: value }));
  };

  return { volumes, updateGeneralVolume, updateGroupVolume };
};
