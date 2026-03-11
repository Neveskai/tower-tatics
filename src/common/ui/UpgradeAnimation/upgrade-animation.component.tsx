import i18n from "@/common/providers/i18n";
import css from "./upgrade-animation.module.css";
import { UpgradeState } from "./upgrade-animation.types";

export function UpgradeAnimation({ state }: { state: UpgradeState }) {
  if (!state.isUpgrading) return null;

  return <div className={css.upgrading}>{i18n.t("upgrading")}</div>;
}
