import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLockClosed } from "react-icons/io5";
import i18n from "@/common/providers/i18n";
import { getTowerUnlockForMap } from "@/common/constants/map-rewards.constants";
import { getFallbackTowerI18nKey } from "@/common/firestore/catalog/catalog.fallback";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { Button } from "@/common/ui/Button";
import type { MapWithUnlock } from "@/common/stores/player/player.types";
import css from "./phase-selector.module.css";

export function PhaseSelector() {
  const navigate = useNavigate();

  const maps = usePlayerStore((state) => state.maps);
  const getMaps = usePlayerStore((state) => state.getMaps);
  const setSelectedMapIndex = usePlayerStore((state) => state.setSelectedMapIndex);

  const [selectedMapIndexLocal, setSelectedMapIndexLocal] = useState<number | null>(null);

  useEffect(() => {
    if (maps.length === 0) {
      getMaps();
    }
  }, [maps.length, getMaps]);

  const currentMaps = maps.length > 0 ? maps : [];

  const handleCardClick = (index: number) => {
    const map = currentMaps[index];
    if (map?.unlocked) {
      setSelectedMapIndexLocal(index);
    }
  };

  const handleStartClick = () => {
    if (selectedMapIndexLocal === null || selectedMapIndexLocal >= currentMaps.length) return;
    const map = currentMaps[selectedMapIndexLocal];
    if (!map?.unlocked) return;

    setSelectedMapIndex(selectedMapIndexLocal);
    navigate("/game", { state: { map } });
  };

  if (currentMaps.length === 0) {
    return (
      <div className={css.wrapper}>
        <p className={css.loading}>{i18n.t("loading")}</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.scrollArea}>
        <h2 className={css.title}>{i18n.t("selectMission")}</h2>

        <div className={css.grid}>
          {currentMaps.map((map, index) => (
            <PhaseCard
              key={map.id}
              map={map}
              isSelected={selectedMapIndexLocal === index}
              onSelect={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>

      <footer className={css.footer}>
        <Button
          className={css.startButton}
          kind="warning"
          size="large"
          disabled={selectedMapIndexLocal === null}
          onClick={handleStartClick}
        >
          {i18n.t("start")}
        </Button>
      </footer>
    </div>
  );
}

interface PhaseCardProps {
  map: MapWithUnlock;
  isSelected: boolean;
  onSelect: () => void;
}

function PhaseCard({ map, isSelected, onSelect }: PhaseCardProps) {
  const isLocked = !map.unlocked;
  const towerReward = getTowerUnlockForMap(map.id);
  const rewardLabel =
    towerReward != null
      ? `${i18n.t("reward")}: ${i18n.t(getFallbackTowerI18nKey(towerReward))}`
      : null;

  return (
    <button
      type="button"
      className={`${css.card} ${isSelected ? css.cardSelected : ""} ${isLocked ? css.cardLocked : ""}`}
      onClick={onSelect}
      disabled={isLocked}
      aria-pressed={isSelected}
      aria-disabled={isLocked}
    >
      <div
        className={css.cardImage}
        style={{ backgroundImage: `url(${map.imagem})` }}
      >
        {isLocked && (
          <span className={css.lockOverlay} aria-hidden>
            <IoLockClosed size={36} />
            {i18n.t("locked")}
          </span>
        )}
      </div>

      <div className={css.cardContent}>
        <h3 className={css.cardTitle}>{map.nome}</h3>
        
        {rewardLabel != null && (
          <p className={css.cardDesc}>{rewardLabel}</p>
        )}

        <div className={css.cardMeta}>
          <span className={css.cardDifficulty}>{map.dificuldade}</span>
          <span className={css.cardWaves}>
            {map.hordas} {i18n.t("waves")}
          </span>
        </div>
      </div>
    </button>
  );
}
