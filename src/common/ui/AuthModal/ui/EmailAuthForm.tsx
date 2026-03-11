import { FC } from "react";
import css from "../auth-modal.module.css";
import i18n from "@/common/providers/i18n";
import { Button } from "@/common/ui";

interface EmailAuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoginMode: boolean;
  loading: boolean;
  onSubmit: () => void;
}

/**
 * Component for email/password authentication form
 */
export const EmailAuthForm: FC<EmailAuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoginMode,
  loading,
  onSubmit,
}) => {
  return (
    <>
      <div className={css.formGroup}>
        <label htmlFor="email" className={css.label}>
          {i18n.t("email")}
        </label>
        <input
          id="email"
          className={css.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="password" className={css.label}>
          {i18n.t("password")}
        </label>
        <input
          id="password"
          className={css.input}
          type="password"
          placeholder={i18n.t("enterPassword")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        style={{ justifyContent: "center" }}
        onClick={onSubmit}
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading
          ? i18n.t("loading")
          : isLoginMode
          ? i18n.t("login")
          : i18n.t("createAccount")}
      </Button>
    </>
  );
};
