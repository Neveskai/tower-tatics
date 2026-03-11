import classNames from "classnames";
import { useGameStore } from "@/Game/common/stores/state";
import i18n from "@/common/providers/i18n";
import css from "./switch-hud.module.css";
import { Gold, Icon } from "@/common/ui";
import { TowerHud } from "../TowerStats";
import { MonsterStats } from "../MonsterStats";
import { NativeTowerShop } from "../TowerShop";
import { HudModes } from "@/common/enum/hud-modes";
import { SWITCH_HUD_BUTTONS } from "./switch-hud.constants";

export const SwitchHud = () => {
  const mode = useGameStore((state) => state.mode);
  const setMode = useGameStore((state) => state.setMode);

  return (
    <>
      <div className={css.SwitchHud}>
        <Gold />

        <div className={css.ModeButtons}>
          {SWITCH_HUD_BUTTONS.map(({ mode: btnMode, icon, titleKey, modeClassKey }) => {
            const isActive = mode === btnMode;
            const modeClass = css[modeClassKey];
            return (
              <button
                key={btnMode}
                type="button"
                className={classNames(
                  css.ModeButton,
                  isActive ? modeClass : css.ModeButtonInactive
                )}
                onClick={() => setMode(btnMode)}
                title={i18n.t(titleKey)}
                aria-label={i18n.t(titleKey)}
                aria-pressed={isActive}
              >
                <Icon name={icon} size={22} />
              </button>
            );
          })}
        </div>
      </div>

      <section className={css.ActiveHud}>
        {mode === HudModes.TOWER && <TowerHud />}

        {mode === HudModes.MONSTER && <MonsterStats />}

        {mode === HudModes.SHOP && <NativeTowerShop />}
      </section>
    </>
  );
};
