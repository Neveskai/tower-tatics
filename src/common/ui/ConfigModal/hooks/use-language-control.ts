import { useState } from "react";
import i18n from "@/common/providers/i18n";
import { setSyncFromLocal } from "@/common/stores/sync/sync.storage";

export const useLanguageControl = () => {
  const [language, setLanguage] = useState(i18n.lang);
  const availableLanguages = ["en", "pt", "es"];

  const changeLanguage = (lang: string) => {
    i18n.setLang(lang);
    setLanguage(lang);
    setSyncFromLocal();
  };

  return { language, availableLanguages, changeLanguage };
};
