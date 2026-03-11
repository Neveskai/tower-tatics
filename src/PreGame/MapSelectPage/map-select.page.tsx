import { useState } from "react";
import { useNavigate } from "react-router-dom";
import layoutCss from "../shared.module.css";
import css from "./map-select.module.css";
import { Navbar } from "@/common/ui/Navbar";
import { PhaseSelector } from "./PhaseSelector";
import { TowersTab } from "./TowersTab";
import { SkillsTab } from "./SkillsTab";
import i18n from "@/common/providers/i18n";
import type { TabId } from "./map-select.types";

export function SelectPhaseScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("maps");
  i18n.useLang();

  return (
    <div className={layoutCss.container}>
      <Navbar onBackClick={() => navigate("/")} />

      <div className={css.mainContent}>
        <nav className={css.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "maps"}
            className={`${css.tab} ${activeTab === "maps" ? css.tabActive : ""}`}
            onClick={() => setActiveTab("maps")}
          >
            {i18n.t("maps")}
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "towers"}
            className={`${css.tab} ${activeTab === "towers" ? css.tabActive : ""}`}
            onClick={() => setActiveTab("towers")}
          >
            {i18n.t("towers")}
          </button>
          
          <button
            role="tab"
            aria-selected={activeTab === "skills"}
            className={`${css.tab} ${activeTab === "skills" ? css.tabActive : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            {i18n.t("skills")}
          </button>
        </nav>

        <div className={css.tabContent}>
          {activeTab === "maps" && <PhaseSelector />}
          {activeTab === "towers" && <TowersTab />}
          {activeTab === "skills" && <SkillsTab />}
        </div>
      </div>

      <div className={layoutCss.version}>{i18n.t("version")}</div>
    </div>
  );
}

