import type { SkillId } from "@/common/enum/skill-ids";
import type { Icons } from "@/common/ui/Icon";

export const MAX_ENABLED = 3;

export const SKILL_I18N_KEY: Record<SkillId, string> = {
  blizzard: "skillBlizzard",
};

export const SKILL_ICON: Record<SkillId, Icons> = {
  blizzard: "blizzard",
};

export const SKILL_DESC_KEY: Record<SkillId, string> = {
  blizzard: "skillDescBlizzard",
};
