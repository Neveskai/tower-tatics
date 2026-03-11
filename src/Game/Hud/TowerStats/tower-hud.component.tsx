import { MAX_TOWER_LEVEL } from "@/Game/common/constants/towers.constants";
import i18n from "@/common/providers/i18n";
import { useEffect, useState } from "react";
import { StatsSection } from "./StatsSection";
import { EMPTY_TOWER, EMPTY_PROGRESS } from "./tower-hud.constants";
import css from "./tower-hud.module.css";
import { Button, Icon, LoadingBar, Tooltip, UpgradeState } from "@/common/ui";
import { useGameStore, usePauseState } from "@/Game/common/stores/state";
import { useGoldStore } from "@/Game/common/stores/gold";

const TowerHud = () => {
  const [hoveringUpgrade, setHoveringUpgrade] = useState(false);
  const [progress, setProgress] = useState<UpgradeState>(EMPTY_PROGRESS);

  const tower = useGameStore((state) => state.selectedTower) || EMPTY_TOWER;
  const { isPausedMidWave, isPreGame } = usePauseState();
  const playerGold = useGoldStore((state) => state.playerGold);

  const nextLevelStats = tower.getNextLevelStats();
  const upgradeCost = nextLevelStats?.cost || 0;
  const isMaxLevel = tower.level >= MAX_TOWER_LEVEL;
  const isAffordable = playerGold >= upgradeCost;
  const canUpgrade = !isMaxLevel && isAffordable && !tower.upgrader.isUpgrading;
  const isEmptyTower = !tower.level;
  const cantIteract = isPausedMidWave;

  const handleUpgradeClick = () => {
    if (canUpgrade) tower.upgrade();
  };

  const handleSellClick = () => {
    if (tower && !progress.isUpgrading) tower.sell();
  };

  useEffect(() => {
    if (tower) {
      setProgress({
        upgradeTimer: tower.upgrader.upgradeTimer,
        maintenanceDuration: tower.upgrader.maintenanceDuration,
        progress: tower.upgrader.progress,
        isUpgrading: tower.upgrader.isUpgrading,
        level: tower.level,
      });

      const unsubscribe = tower.onUpgradeChange((state) => {
        setProgress(state);
      });

      return () => {
        unsubscribe();
        setProgress(EMPTY_PROGRESS);
      };
    }
  }, [tower]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cantIteract || isEmptyTower) return;

      if (e.key.toLowerCase() === "e") {
        handleUpgradeClick();
      } else if (e.key.toLowerCase() === "s") {
        handleSellClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cantIteract, isEmptyTower, canUpgrade, tower]);

  const sellValue = isPreGame ? tower.cost : tower.sell_price;
  const titleLeft = (
    <Tooltip
      title={
        <>
          {sellValue} {i18n.t("gold")}
          <Icon name="sell" size={16} alt="" />
        </>
      }
      body={i18n.t("tooltipSellDesc")}
    >
      <Button
        onClick={handleSellClick}
        disabled={
          isEmptyTower || cantIteract || tower.upgrader.isUpgrading
        }
        className={css.titleBtn + ' ' + css.sellBtn}
        size="small"
        kind="warning"
        aria-label={i18n.t("sell")}
      >
        <Icon name="sell" size={16} alt={i18n.t("sell")} />
      </Button>
    </Tooltip>
  );

  const titleRight = (
    <Tooltip
      title={
        <>
          {upgradeCost} {i18n.t("gold")}
          <Icon name="upgrade" size={16} alt="" />
        </>
      }
      body={i18n.t("tooltipUpgradeDesc")}
    >
      <Button
        onClick={handleUpgradeClick}
        disabled={!canUpgrade || isEmptyTower || cantIteract}
        onMouseEnter={() => setHoveringUpgrade(true)}
        onMouseLeave={() => setHoveringUpgrade(false)}
        className={css.titleBtn + ' ' + css.upgradeBtn}
        size="small"
        kind="secondary"
        aria-label={i18n.t("upgrade")}
      >
        <Icon name="upgrade" size={16} alt={i18n.t("upgrade")} />
      </Button>
    </Tooltip>
  );

  const actions = progress.isUpgrading ? (
    <div className={css.actionsLoading}>
      <LoadingBar progress={progress} />
    </div>
  ) : null;

  return (
    <div className={css.ContainerA}>
      <StatsSection
        tower={tower}
        hoveringUpgrade={hoveringUpgrade}
        titleLeft={titleLeft}
        titleRight={titleRight}
        actions={actions}
        actionsStretch={progress.isUpgrading}
      />
    </div>
  );
};

export { TowerHud };
