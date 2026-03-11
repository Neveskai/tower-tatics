import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/common/providers/firebase";
import { toast } from "react-toastify";

/**
 * Hook for handling email/password authentication
 */
export const useEmailAuth = (onLoginSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleEmailAuth = async () => {
    setLoading(true);

    try {
      if (isLoginMode) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message || "Erro na autenticação", { autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    onLoginSuccess();
  };

  const handleSignup = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    toast.success("Conta criada! Verifique seu e-mail antes de continuar.");
    setIsLoginMode(true);
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoginMode,
    loading,
    handleEmailAuth,
    toggleAuthMode,
  };
};
