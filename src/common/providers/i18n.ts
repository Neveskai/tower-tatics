import { translations } from "@/common/constants/translations.constants";
import { loadLanguage, saveLanguage } from "@/common/stores/lang/lang.storage";
import { useEffect, useState } from "react";

type Translations = {
  [lang: string]: {
    [key: string]: string;
  };
};

type LangChangeListener = (newLang: string) => void;

class I18N {
  public lang: string = "en";
  private translations: Translations = {};
  private listeners: LangChangeListener[] = [];

  constructor() {
    this.init();
  }

  public async init() {
    const persistedLang = await loadLanguage();

    if (persistedLang) {
      this.lang = persistedLang;
    } else {
      this.lang = this.detectLanguage();
    }

    this.notify();
  }

  private detectLanguage(): string {
    return navigator?.language ? navigator?.language.split("-")[0] : "en";
  }

  public setLang(lang: string) {
    if (this.lang !== lang) {
      this.lang = lang;
      saveLanguage(lang);
      this.notify();
    }
  }

  public loadTranslations(translations: Translations) {
    this.translations = translations;
  }

  public t(key: string): string {
    if (!this.translations) return key;

    if (this.translations[this.lang] && this.translations[this.lang][key]) {
      return this.translations[this.lang][key];
    }

    return key;
  }

  public subscribe(listener: LangChangeListener) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: LangChangeListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.lang));
  }

  // @react-hook
  public useLang() {
    const [, setLang] = useState("");

    useEffect(() => {
      setLang(this.lang);

      const handleLangChange = (newLang: string) => setLang(newLang);

      this.subscribe(handleLangChange);
      return () => this.unsubscribe(handleLangChange);
    }, []);
  }
}

const i18n = new I18N();

i18n.loadTranslations(translations);

export default i18n;
