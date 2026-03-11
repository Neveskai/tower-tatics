import { useEffect, useState } from "react";
import { HudText } from "../HudText";
import { Icon } from "../Icon";
import css from "./gold.module.css";
import { useGoldStore } from "@/Game/common/stores/gold";

let interval: NodeJS.Timeout;

export const Gold = () => {
  const gold = useGoldStore((state) => state.playerGold);
  const [displayValue, setDisplayValue] = useState(gold);

  const getAnimation = (step: number, intervalTime: number) => {
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      setDisplayValue((prev) => {
        const next = prev + step;

        if ((step > 0 && next >= gold) || (step < 0 && next <= gold)) {
          clearInterval(interval);
          return gold;
        }

        return next;
      });
    }, intervalTime);
  };

  const animateDisplay = () => {
    if (displayValue === gold) return;

    const difference = gold - displayValue;
    const steps = Math.abs(difference);
    const step = difference > 0 ? 1 : -1;

    const duration = 250;
    const intervalTime = duration / steps;

    getAnimation(step, intervalTime);
  };

  useEffect(() => {
    animateDisplay();
  }, [gold]);

  return (
    <div className={css.GoldPanel}>
      <HudText
        label={<Icon name="coin" size={20} className={css.GoldIcon} />}
        value={displayValue}
        className={css.TextGold}
      />
    </div>
  );
};
