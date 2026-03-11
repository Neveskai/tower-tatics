import { useState, useMemo } from "react";
import type { SkillId } from "@/common/enum/skill-ids";
import { SKILL_IDS_ORDER } from "@/common/enum/skill-ids";
import i18n from "@/common/providers/i18n";
import { useSkillProgressStore } from "@/common/stores/skill-progress/skill-progress.store";
import { clampEnabled } from "@/common/stores/skill-progress/skill-progress.storage";
import { Button } from "@/common/ui/Button";
import { Icon } from "@/common/ui";
import {
  MAX_ENABLED,
  SKILL_I18N_KEY,
  SKILL_ICON,
  SKILL_DESC_KEY,
} from "./skills-tab.constants";
import type { SkillStatus } from "./skills-tab.types";
import css from "./skills-tab.module.css";

export function SkillsTab() {
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null);

  const skillProgress = useSkillProgressStore((s) => s.skillProgress);
  const enableSkill = useSkillProgressStore((s) => s.enableSkill);
  const disableSkill = useSkillProgressStore((s) => s.disableSkill);

  const enabled = useMemo(() => {
    if (!skillProgress) return ["blizzard" as SkillId];

    return skillProgress.enabled.length > 0
      ? clampEnabled(skillProgress.enabled, skillProgress.unlocked)
      : [SKILL_IDS_ORDER[0]];
  }, [skillProgress]);

  const unlocked = useMemo(
    () => skillProgress?.unlocked ?? [SKILL_IDS_ORDER[0]],
    [skillProgress]
  );

  const canEnableMore = enabled.length < MAX_ENABLED;

  function getStatus(id: SkillId): SkillStatus {
    if (enabled.includes(id)) return "enabled";
    if (unlocked.includes(id)) return "unlocked";

    return "locked";
  }

  function getSkillName(id: SkillId): string {
    return i18n.t(SKILL_I18N_KEY[id]);
  }

  async function handleToggleEnable(id: SkillId) {
    const status = getStatus(id);

    if (status === "locked") return;

    if (status === "enabled") {
      await disableSkill(id);
    } else if (canEnableMore) {
      await enableSkill(id);
    }
  }

  if (!skillProgress) {
    return (
      <div className={css.wrapper}>
        <p className={css.loading}>{i18n.t("loading")}</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.scrollArea}>
        <h2 className={css.title}>{i18n.t("selectSkillsLoadout")}</h2>

        <div className={css.enabledHeader}>
          <span className={css.enabledLabel}>
            {i18n.t("enabledSkillsCount").replace("x", String(enabled.length))}
          </span>

          <div className={css.enabledChips}>
            {enabled.map((id) => (
              <span key={id} className={css.chip}>
                {getSkillName(id)}
              </span>
            ))}

            {Array.from({ length: MAX_ENABLED - enabled.length }).map((_, i) => (
              <span key={`empty-${i}`} className={css.chipEmpty}>
                —
              </span>
            ))}
          </div>
        </div>

        <div className={css.grid}>
          {SKILL_IDS_ORDER.map((id) => {
            const status = getStatus(id);
            const isSelected = selectedSkill === id;
            const canToggle =
              status !== "locked" && (status === "enabled" || canEnableMore);

            return (
              <div
                key={id}
                className={`${css.card} ${isSelected ? css.cardSelected : ""} ${status === "locked" ? css.cardLocked : ""}`}
                onClick={() => setSelectedSkill(id)}
              >
                <div className={css.cardIcon}>
                  <Icon name={SKILL_ICON[id]} size={48} />

                  <span className={`${css.badge} ${css[`badge--${status}`]}`}>
                    {status === "enabled" && i18n.t("equipped")}
                    {status === "unlocked" && i18n.t("unlocked")}
                    {status === "locked" && i18n.t("toDiscover")}
                  </span>
                </div>

                <div className={css.cardContent}>
                  <h3 className={css.cardTitle}>{getSkillName(id)}</h3>

                  <Button
                    kind="warning"
                    size="small"
                    disabled={!canToggle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEnable(id);
                    }}
                  >
                    {status === "enabled" ? i18n.t("unequip") : i18n.t("equip")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSkill && (
        <div className={css.detailsPanel}>
          <div className={css.detailsContent}>
            <h3>{getSkillName(selectedSkill)}</h3>
            
            <p className={css.detailsDescription}>
              {i18n.t(SKILL_DESC_KEY[selectedSkill])}
            </p>

            <Button
              kind="secondary"
              size="small"
              className={css.backButton}
              onClick={() => setSelectedSkill(null)}
            >
              {i18n.t("back")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
