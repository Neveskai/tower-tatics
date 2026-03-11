import { useState } from "react";
import i18n from "@/common/providers/i18n";
import css from "../config-modal.module.css";
import classNames from "classnames";
import { Icon, Icons } from "@/common/ui";
import { useLanguageControl } from "../hooks/use-language-control";

export const LanguageSelector = () => {
  const { language, availableLanguages, changeLanguage } = useLanguageControl();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang: string) => {
    if (lang !== language) changeLanguage(lang);

    setIsOpen(false);
  };

  return (
    <div className={css.formGroup}>
      <label className={css.label}>{i18n.t("language")}</label>
      <div className={css.customSelectWrapper}>
        <div
          className={css.customSelectTrigger}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className={css.flag}>
            <Icon name={language as Icons} />
          </span>
          <span>{i18n.t(language)}</span>
          <span className={css.arrow}>{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className={css.customSelectOptions}>
            {availableLanguages.map((lang) => (
              <div
                key={lang}
                className={classNames(css.option, {
                  [css.selected]: lang === language,
                })}
                onClick={() => handleSelect(lang)}
              >
                <span className={css.flag}>
                  <Icon name={lang as Icons} />
                </span>
                <span>{i18n.t(lang)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
