import { FC } from "react";
import css from "../auth-modal.module.css";
import i18n from "@/common/providers/i18n";

interface AuthToggleProps {
  isLoginMode: boolean;
  onToggle: () => void;
}

/**
 * Component for toggling between login and signup modes
 */
export const AuthToggle: FC<AuthToggleProps> = ({ isLoginMode, onToggle }) => {
  return (
    <p className={css.loginLink}>
      {isLoginMode ? i18n.t("noAccount") : i18n.t("haveAccount")}
      <span onClick={onToggle} className={css.link}>
        {isLoginMode ? " " + i18n.t("createAccount") : " " + i18n.t("login")}
      </span>
    </p>
  );
};
