import { Application, Text, TextStyle } from "pixi.js";
export function createFPSDisplay(app: Application): Text {
  const fpsStyle = new TextStyle({
    fill: "#ffffff",
    fontSize: 13,
    fontFamily: "monospace",
  });

  const gap = 30
  const fpsText = new Text({ text: "FPS: --", style: fpsStyle });
  fpsText.x = window.innerWidth * 0.88 - gap;
  fpsText.y = 22;
  fpsText.zIndex = 10000;
  app.stage.addChild(fpsText);

  let lastTime = performance.now();
  let frames = 0;

  app.ticker.add(() => {
    frames++;
    const now = performance.now();
    const delta = now - lastTime;
    if (delta >= 1000) {
      const fps = (frames * 1000) / delta;
      fpsText.text = `FPS: ${fps.toFixed(1)}`;
      lastTime = now;
      frames = 0;
    }
  });

  return fpsText;
}
