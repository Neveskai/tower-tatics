import { RefObject, useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/common/stores/player/player.store";

import { useAuthControl } from "./hooks/use-auth-control";
import { useClickOutside } from "./hooks/use-click-outside";

import css from "./config-modal.module.css";
import { UserSection } from "./ui/user-section";
import { VolumeSliders } from "./ui/volume-sliders";
import { LanguageSelector } from "./ui/language-selector";
import i18n from "@/common/providers/i18n";
import { ErrorBoundary } from "@/common/ui/ErrorBoundary";
import { verifyAndSyncFromLocal } from "@/common/stores/sync/sync.storage";

export const ConfigModal = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const user = usePlayerStore((s) => s.user);
  const setAuthModal = usePlayerStore((s) => s.setAuthModal);
  const setConfigModal = usePlayerStore((s) => s.setConfigModal);
  const closeModal = () => setConfigModal(false);

  const { logout } = useAuthControl();

  useClickOutside(dropdownRef as RefObject<HTMLDivElement>, () =>
    setShowDropdown(false)
  );

  const handleLoginClick = () => {
    closeModal();
    setAuthModal(true);
  };

  i18n.useLang();

  useEffect(
    () => () => {
      if (user) verifyAndSyncFromLocal(user);
    },
    [user]
  );

  return (
    <ErrorBoundary>
      <div className={css.modalBackdrop} onClick={closeModal}>
        <div className={css.modal} onClick={(e) => e.stopPropagation()}>
          <UserSection
            user={user}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            dropdownRef={dropdownRef as RefObject<HTMLDivElement>}
            onLoginClick={handleLoginClick}
            onLogoutClick={logout}
          />

          <h2 className={css.modalTitle}>{i18n.t("config")}</h2>

          <LanguageSelector />

          <VolumeSliders />
        </div>
      </div>
    </ErrorBoundary>
  );
};
