import css from "./auth-modal.module.css";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { useEmailAuth, useGoogleAuth } from "./hooks";
import { EmailAuthForm, GoogleAuthButton, AuthToggle } from "./ui";
import i18n from "@/common/providers/i18n";
import { ErrorBoundary } from "@/common/ui/ErrorBoundary";

/**
 * Modal component for user authentication
 */
export const AuthModal = () => {
  const setAuthModal = usePlayerStore((state) => state.setAuthModal);

  const closeModal = () => setAuthModal(false);


  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoginMode,
    loading: emailLoading,
    handleEmailAuth,
    toggleAuthMode,
  } = useEmailAuth(closeModal);

  const { loading: googleLoading, handleGoogleLogin } =
    useGoogleAuth(closeModal);

  // Determine if any authentication method is loading
  const isLoading = emailLoading || googleLoading;

  return (
    <ErrorBoundary>
      <div className={css.modalBackdrop} onClick={closeModal}>
        <div className={css.modal} onClick={(e) => e.stopPropagation()}>
          <h2 className={css.modalTitle}>
            {isLoginMode
              ? i18n.t("login")
              : i18n.t("createAccount")}
          </h2>

          <EmailAuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoginMode={isLoginMode}
            loading={isLoading}
            onSubmit={handleEmailAuth}
          />

          <AuthToggle isLoginMode={isLoginMode} onToggle={toggleAuthMode} />

          <GoogleAuthButton loading={isLoading} onClick={handleGoogleLogin} />
        </div>
      </div>
    </ErrorBoundary>
  );
};
