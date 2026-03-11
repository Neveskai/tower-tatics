import { useEffect, useRef, useState } from "react";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import layoutCss from "../shared.module.css";
import preloadCss from "./preload.module.css";
import { Navbar } from "@/common/ui/Navbar";
import { PlayButton } from "./PlayButton";
import { isNativePlatform } from "@/common/constants/responsivity.constants";
import i18n from "@/common/providers/i18n";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { hidePreloader } from "@/common/ui/LoadScreen";
import { RenderState } from "@/Game/Render/render";
import { runMenuBackgroundScene } from "./background-scene";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PreloadScreen() {
  const [canRender, setCanRender] = useState(false);
  const user = usePlayerStore((state) => state.user);
  const setAuthModal = usePlayerStore((state) => state.setAuthModal);
  const pixiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNativePlatform) GoogleAuth.initialize();
    if (!user) setAuthModal(true);

    hideLoader();
  }, []);

  useEffect(() => {
    if (!canRender) return;
    const el = pixiContainerRef.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const startScene = () => {
      runMenuBackgroundScene(el).then((fn) => {
        if (!cancelled) cleanup = fn;
        else fn();
      });
    };

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(startScene);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, [canRender]);

  const hideLoader = async () => {
    await hidePreloader();

    setCanRender(true);
  };

  i18n.useLang();

  if (!canRender) return null;

  return (
    <div className={preloadCss.startScreen}>
      <div ref={pixiContainerRef} className={preloadCss.pixiBackground} aria-hidden />
      <div className={preloadCss.arenaLayer} aria-hidden />
      <div className={`${layoutCss.container} ${preloadCss.content}`}>
        <Navbar hideSettings />

        <PlayButton />

        <div className={layoutCss.version}>{i18n.t("version")}</div>
      </div>
    </div>
  );
}

export function renderLandingPage() {
  RenderState.clearHUD();

  RenderState.UI_root = createRoot(document.getElementById("react-root")!);
  RenderState.UI_root.render(
    <>
      <ToastContainer />
      <PreloadScreen />
    </>
  );
}
