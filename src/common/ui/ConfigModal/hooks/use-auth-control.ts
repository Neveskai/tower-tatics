import { getAuth, signOut } from "firebase/auth";
import { usePlayerStore } from "@/common/stores/player/player.store";

export const useAuthControl = () => {
  const setUser = usePlayerStore((s) => s.setUser);

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
  };

  return { logout };
};
