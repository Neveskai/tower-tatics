import { runMenuBackgroundScene } from "@/PreGame/PreloadPage/background-scene";

let preloaderSceneCleanup: (() => void) | null = null;
let preloaderSceneCancelled = false;

export function showPreloader() {
  preloaderSceneCancelled = false;
  document.getElementById("preloader")?.classList.remove("hidden");

  const container = document.getElementById("preloader-pixi-background");
  if (container) {
    runMenuBackgroundScene(container).then((cleanup) => {
      if (preloaderSceneCancelled) cleanup();
      else preloaderSceneCleanup = cleanup;
    });
  }
}

export function hidePreloader(): Promise<true> {
  preloaderSceneCancelled = true;
  if (preloaderSceneCleanup) {
    preloaderSceneCleanup();
    preloaderSceneCleanup = null;
  }

  const progressBar = document.getElementById("preloader-progress");
  if (!progressBar) return Promise.resolve(true);

  if (window.fakeLoaderInterval) clearInterval(window.fakeLoaderInterval);
  updatePreloaderProgress(100);

  setTimeout(
    () => document.getElementById("preloader")?.classList.add("hidden"),
    75
  );

  setTimeout(() => updatePreloaderProgress(0), 150);

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, 375)
  );
}

export function updatePreloaderProgress(percentage: number) {
  const progressBar = document.getElementById(
    "preloader-progress"
  ) as HTMLElement | null;
  if (!progressBar) return;

  progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
}

export function fakeLoader(): Promise<true> {
  showPreloader();

  return new Promise((resolve) => {
    let progress = 0;

    const totalDuration = 300 + Math.random() * 200;
    const stepCount = 20;
    const stepSize = 100 / stepCount;
    const stepInterval = totalDuration / stepCount;

    window.fakeLoaderInterval = setInterval(() => {
      progress += stepSize;
      updatePreloaderProgress(progress);

      if (progress >= 100) {
        clearInterval(window.fakeLoaderInterval);

        hidePreloader().then(() => {
          resolve(true);
        });
      }
    }, stepInterval);
  });
}

export function createLoadingScreen() {
  showPreloader();

  return {
    setProgress: (value: number) => {
      updatePreloaderProgress(value * 100);
    },
    destroy: () => {
      return hidePreloader();
    },
  };
}
