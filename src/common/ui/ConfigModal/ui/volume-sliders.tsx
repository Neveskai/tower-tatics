import { Slider } from "@/common/ui";
import i18n from "@/common/providers/i18n";
import { SoundGroups } from '@/common/enum/sound-groups'
import css from "../config-modal.module.css";
import { useVolumeControl } from "../hooks/use-volume-control";

export const VolumeSliders = () => {
  const { volumes, updateGeneralVolume, updateGroupVolume } =
    useVolumeControl();

  return (
    <div className={css.formGroup}>
      <Slider
        label={i18n.t("general")}
        value={volumes.general}
        onChange={updateGeneralVolume}
      />
      
      <Slider
        label={i18n.t("musics")}
        value={volumes.musics}
        onChange={(v) => updateGroupVolume(SoundGroups.Musics, v)}
      />

      <Slider
        label={i18n.t("voices")}
        value={volumes.voices}
        onChange={(v) => updateGroupVolume(SoundGroups.Voices, v)}
      />

      <Slider
        label={i18n.t("monsters")}
        value={volumes.monsters}
        onChange={(v) => updateGroupVolume(SoundGroups.Monsters, v)}
      />

      <Slider
        label={i18n.t("effects")}
        value={volumes.effects}
        onChange={(v) => updateGroupVolume(SoundGroups.Effects, v)}
      />
    </div>
  );
};
