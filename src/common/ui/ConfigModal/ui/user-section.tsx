import { Button } from "@/common/ui";
import i18n from "@/common/providers/i18n";
import css from "../config-modal.module.css";
import { User } from "firebase/auth";

interface Props {
  user: User | null;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const UserSection = ({
  user,
  showDropdown,
  setShowDropdown,
  dropdownRef,
  onLoginClick,
  onLogoutClick,
}: Props) => {
  if (!user) {
    return (
      <Button
        onClick={onLoginClick}
        variant="outlined"
        style={{ marginLeft: "auto" }}
      >
        {i18n.t("login")}
      </Button>
    );
  }

  const initial =
    user.email?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase();

  return (
    <div className={css.userSection} ref={dropdownRef}>
      <div
        className={css.userCircle}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {initial}
      </div>
      {showDropdown && (
        <div className={css.dropdownMenu}>
          <Button onClick={onLogoutClick} kind="white">
            {i18n.t("logout")}
          </Button>
        </div>
      )}
    </div>
  );
};
