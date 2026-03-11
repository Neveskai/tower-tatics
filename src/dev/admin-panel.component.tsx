import { useState } from "react";
import { useGameStore } from "@/Game/common/stores/state";
import { useSkillEnergyStore } from "@/Game/common/stores/skill-energy/skill-energy.store";
import { renderMissionCompleteScreen } from "@/Game/screen/MissionCompleteScreen";
import css from "./admin-panel.module.css";

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const gameController = useGameStore((s) => s.gameController);
  const mapId = gameController?.getCurrentMapId();
  const canCompleteMission = gameController != null && mapId != null;
  const infiniteMana = useSkillEnergyStore((s) => s.infiniteMana);
  const setInfiniteMana = useSkillEnergyStore((s) => s.setInfiniteMana);

  const handleCompleteMission = async () => {
    if (!gameController || mapId == null) return;
    gameController.pauseGame();
    await renderMissionCompleteScreen(mapId);
  };

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={css.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        DEV
      </button>
      {open && (
        <div className={css.panel}>
          <label className={css.toggleRow}>
            <input
              type="checkbox"
              checked={infiniteMana}
              onChange={(e) => setInfiniteMana(e.target.checked)}
            />
            <span>Mana infinita</span>
          </label>
          <button
            type="button"
            className={css.action}
            disabled={!canCompleteMission}
            onClick={handleCompleteMission}
          >
            Completar missão
          </button>
        </div>
      )}
    </div>
  );
}
