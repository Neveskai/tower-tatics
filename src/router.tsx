import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./common/providers/firebase";
import { usePlayerStore } from "./common/stores/player/player.store";
import { useCatalogStore } from "./common/stores/catalog/catalog.store";
import { useInventoryStore } from "./common/stores/inventory/inventory.store";
import { useSkillProgressStore } from "./common/stores/skill-progress/skill-progress.store";
import { fakeLoader, hidePreloader } from "@/common/ui";
import { PreloadScreen, SelectPhaseScreen } from "@/PreGame";
import { syncFromRemote } from "./common/functions/firebase-sync";
import { setNavigate, type NavigateOptions } from "./common/functions/navigation";
import { GamePage } from "./Game/screen/GameScreen";

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const fn = (to: string | number, options?: NavigateOptions) => navigate(to as string, options);
    setNavigate(fn);
    return () => setNavigate(null);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<PreloadScreen />} />
      <Route path="/play" element={<SelectPhaseScreen />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default function Router() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fakeLoader();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { setUser } = usePlayerStore.getState();

        setUser(user);
        hidePreloader();

        await syncFromRemote(user.uid);
      }

      await Promise.all([
        useCatalogStore.getState().loadCatalog(),
        useInventoryStore.getState().loadInventory(),
        useSkillProgressStore.getState().loadSkillProgress(),
      ]);

      setReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
}
