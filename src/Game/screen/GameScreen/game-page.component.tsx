import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Application } from "pixi.js";
import { loadAssets } from "@/common/assets/load-assets";
import { GameController } from "@/Game/game.controller";
import { SCREEN } from "@/Game/common";
import { RenderState } from "@/Game/Render/render";
import { createLoadingScreen, fakeLoader } from "@/common/ui";
import { Hud } from "@/Game/Hud";
import type { PlacementConfig } from "@/Game/Placement";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { useGameStore } from "@/Game/common/stores/state";
import { useSkillEnergyStore } from "@/Game/common/stores/skill-energy/skill-energy.store";
import SoundLayer from "@/common/sound";

async function runLoadScreen() {
  const loadingScreen = createLoadingScreen();

  if (RenderState.shouldLoadAssets) {
    RenderState.shouldLoadAssets = false;
    
    await loadAssets((progress) => {
      loadingScreen.setProgress(progress);
    });
  } else {
    await fakeLoader();
  }

  await loadingScreen.destroy();
}

export function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const map = location.state?.map as PlacementConfig | undefined;
  const maps = usePlayerStore((s) => s.maps);
  const selectedMapIndex = usePlayerStore((s) => s.selectedMapIndex);
  const getMaps = usePlayerStore((s) => s.getMaps);
  const resetStore = useGameStore((s) => s.resetStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let resizeListener: (() => void) | undefined;

    const initGame = async (targetMap: PlacementConfig) => {
      SCREEN.updateDimensions();
      RenderState.clearGame();

      RenderState.app = new Application();
      await RenderState.app.init({
        backgroundAlpha: 0,
        width: SCREEN.WIDTH,
        height: SCREEN.HEIGHT,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      RenderState.container.style.display = "block";
      RenderState.container?.appendChild(RenderState.app.canvas);

      await runLoadScreen();
      if (cancelled) return;

      const gameController = new GameController(RenderState.app, targetMap);
      useGameStore.getState().setIntervalMs(targetMap.waveIntervalSeconds * 1000);
      useGameStore.getState().setCountdown(targetMap.waveIntervalSeconds);

      resizeListener = () => {
        if (RenderState.resizeTimeout) clearTimeout(RenderState.resizeTimeout);
        
        RenderState.resizeTimeout = setTimeout(() => {
          SCREEN.updateDimensions();
          gameController.gridResize();
        }, 100);
      };
      window.addEventListener("resize", resizeListener);
      RenderState.resizeListener = resizeListener;

      if (!cancelled) setReady(true);
    };

    const run = async () => {
      let targetMap = map;
      if (!targetMap && maps.length > 0 && selectedMapIndex >= 0 && selectedMapIndex < maps.length) {
        targetMap = maps[selectedMapIndex];
      }
      if (!targetMap) {
        const currentMaps = usePlayerStore.getState().maps;
        if (currentMaps.length === 0) await getMaps();
        const nextMaps = usePlayerStore.getState().maps;
        if (nextMaps.length > 0) {
          usePlayerStore.getState().setSelectedMapIndex(0);
          targetMap = nextMaps[0];
        }
      }
      if (!targetMap) {
        setError(true);
        return;
      }
      await initGame(targetMap);
    };

    run();

    return () => {
      cancelled = true;
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
        RenderState.resizeListener = undefined;
      }
      SoundLayer.stopAllGameSounds();
      const skillEnergy = useSkillEnergyStore.getState();
      skillEnergy.stopRegen();
      skillEnergy.reset();
      resetStore();
      RenderState.clearGame();
    };
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  if (error) return null;
  if (!ready) return null;

  return <Hud />;
}
