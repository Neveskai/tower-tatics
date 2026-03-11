import { FC } from "react";
import css from "../auth-modal.module.css";
import i18n from "@/common/providers/i18n";
import { getAssetUrl } from "@/common/assets/get-asset-url";

interface GoogleAuthButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  loading,
  onClick,
}) => {
  return (
    <>
      <div className={css.divider}>{i18n.t("or")}</div>
      <button
        onClick={onClick}
        disabled={loading}
        className={css.button}
      >
        {loading ? (
          i18n.t("loading")
        ) : (
          <>
            <img
              src={getAssetUrl("/assets/images/google.webp")}
              alt="Google icon"
              className={css.googleIcon}
            />
            {i18n.t("continueWithGoogle")}
          </>
        )}
      </button>
    </>
  );
};
