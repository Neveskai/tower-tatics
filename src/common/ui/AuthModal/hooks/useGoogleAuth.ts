import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { auth } from "@/common/providers/firebase";
import { isNativePlatform } from "@/common/constants/responsivity.constants";
import { toast } from "react-toastify";

export const useGoogleAuth = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      if (isNativePlatform) {
        await handleNativeGoogleAuth();
      } else {
        await handleWebGoogleAuth();
      }

      onSuccess();
    } catch (error) {
      const message = (error as { message: string }).message;

      toast.error(message || "Erro no login Google", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleNativeGoogleAuth = async () => {
    const googleUser = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(
      googleUser.authentication.idToken
    );

    await signInWithCredential(auth, credential);
  };

  const handleWebGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  };

  return {
    loading,
    handleGoogleLogin,
  };
};
