import css from "./navbar.module.css";
import { usePlayerStore } from "@/common/stores/player/player.store";
import i18n from "@/common/providers/i18n";
import { ConfigModal } from "@/common/ui/ConfigModal";
import { AuthModal } from "@/common/ui/AuthModal";
import { Icon } from "@/common/ui";

interface NavbarProps {
  onBackClick?: () => void;
  hideSettings?: boolean;
}

export const Navbar = ({ onBackClick, hideSettings }: NavbarProps) => {
  const authModal = usePlayerStore((state) => state.authModal);
  const configModal = usePlayerStore((state) => state.configModal);
  const setConfigModal = usePlayerStore((state) => state.setConfigModal);

  return (
    <>
      <div className={css.navbar}>
        {onBackClick && (
          <button
            type="button"
            className={css.backButton}
            onClick={onBackClick}
            aria-label={i18n.t("back")}
          >
            <Icon name="back" size={24} />
          </button>
        )}

        {!hideSettings && (
          <div className={css.userSection}>
            <div className={css.userCircle} onClick={() => setConfigModal(true)}>
              <Icon name="settings" size={36} />
            </div>
          </div>
        )}
      </div>

      {authModal && <AuthModal />}

      {configModal && <ConfigModal />}
    </>
  );
};
