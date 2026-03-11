import { TowerTypes } from "@/common/enum/tower-types";
import classNames from "classnames";
import css from "./shop-button.module.css";
import { TowerCharacter } from "@/Game/Character/Tower";
import { TowerImgContainer, Icon } from "@/common/ui";
import { useGameStore } from "@/Game/common/stores/state";

interface TowerButtonProps {
  type: TowerTypes;
  label: string;
  cost: number;
  playerGold: number;
  handleSelectTower: (type: TowerTypes) => void;
}

export const ShopButton = ({
  type,
  label,
  cost,
  playerGold,
  handleSelectTower,
}: TowerButtonProps) => {
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);
  const canAfford = playerGold >= cost;

  const buttonClass = classNames(css.TowerShopButton, {
    [css.disabled]: !canAfford,
    [css.ActiveTowerButton]: selectedTowerType === type,
  });

  const costClass = classNames(css.cost, {
    [css.costDisabled]: !canAfford,
  });

  const imageContainerStyle = {
    width: "50px",
    height: "38px",
  };

  const weaponStyle: React.CSSProperties = {
    bottom: type === "electric" ? "-2px" : "0px",
    left: type === "machine-gun" || type === "heavy-gun" ? "4px" : "8px",
    width: type === "anti-air" ? "44px" : "40px",
  };

  if (type === "anti-air") weaponStyle.left = "6px";

  return (
    <button
      className={buttonClass}
      disabled={!canAfford}
      onClick={() => canAfford && handleSelectTower(type)}
      aria-label={`${label} - ${cost} gold`}
      title={label}
    >
      <TowerImgContainer
        tower={{ getType: () => type, level: 1 } as TowerCharacter}
        weaponStyle={weaponStyle}
        imageContainerStyle={imageContainerStyle}
      />

      <span className={costClass}>
        <Icon name="coin" size={14} />
        {cost}
      </span>
    </button>
  );
};
