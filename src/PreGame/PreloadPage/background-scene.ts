import { Application, Graphics } from "pixi.js";

const BACKGROUND_COLOR = 0x0a1210;
const TRACE_COLOR_DARK = 0x3d6b4f;
const TRACE_COLOR_LIGHT = 0x8bc98b;
const TRACE_STROKE_WIDTH = 2;
const HORIZONTAL_TRACE_COUNT = 18;
const VERTICAL_TRACE_COUNT = 22;

const SPEED_HORIZONTAL_SLOW_MIN = 0.01;
const SPEED_HORIZONTAL_SLOW_MAX = 0.02;
const SPEED_HORIZONTAL_MEDIUM_MIN = 0.03;
const SPEED_HORIZONTAL_MEDIUM_MAX = 0.05;
const SPEED_HORIZONTAL_FAST_MIN = 0.055;
const SPEED_HORIZONTAL_FAST_MAX = 0.075;

const SPEED_VERTICAL_SLOW_MIN = 0.03;
const SPEED_VERTICAL_SLOW_MAX = 0.06;
const SPEED_VERTICAL_MEDIUM_MIN = 0.07;
const SPEED_VERTICAL_MEDIUM_MAX = 0.12;
const SPEED_VERTICAL_FAST_MIN = 0.13;
const SPEED_VERTICAL_FAST_MAX = 0.18;

const WORM_TRAIL_COLOR = 0xffd700;
const WORM_STROKE_WIDTH = 2;
const WORM_TRAIL_ALPHA_OLD = 0.30;
const WORM_TRAIL_ALPHA_NEW = 0.92;
const WORM_SPEED = 0.04;
const WORM_SEGMENT_VERTICAL_MIN = 180;
const WORM_SEGMENT_VERTICAL_MAX = 240;
const WORM_SEGMENT_HORIZONTAL_MIN = 25;
const WORM_SEGMENT_HORIZONTAL_MAX = 50;
const WORM_TRAIL_MAX_POINTS = 600;

interface ProjectileData {
  gfx: Graphics;
  speedX: number;
  x: number;
  y: number;
  w: number;
}

interface VerticalTraceData {
  gfx: Graphics;
  x: number;
  y: number;
  height: number;
  speedY: number;
}

type WormPhase = "up" | "horizontal";

interface GoldenWormData {
  trailGfx: Graphics;
  trailPoints: { x: number; y: number }[];
  x: number;
  y: number;
  phase: WormPhase;
  directionX: number;
  segmentLength: number;
  segmentProgress: number;
  spawnDelay: number;
}

function drawBackground(gfx: Graphics, w: number, h: number) {
  gfx.clear();
  gfx.rect(0, 0, w, h);
  gfx.fill({ color: BACKGROUND_COLOR, alpha: 1 });
}

function pickHorizontalSpeedMagnitude(): number {
  const r = Math.random();
  if (r < 0.3) {
    return SPEED_HORIZONTAL_SLOW_MIN + Math.random() * (SPEED_HORIZONTAL_SLOW_MAX - SPEED_HORIZONTAL_SLOW_MIN);
  }
  if (r < 0.8) {
    return SPEED_HORIZONTAL_MEDIUM_MIN + Math.random() * (SPEED_HORIZONTAL_MEDIUM_MAX - SPEED_HORIZONTAL_MEDIUM_MIN);
  }
  return SPEED_HORIZONTAL_FAST_MIN + Math.random() * (SPEED_HORIZONTAL_FAST_MAX - SPEED_HORIZONTAL_FAST_MIN);
}

function pickVerticalSpeedMagnitude(): number {
  const r = Math.random();
  if (r < 0.3) {
    return SPEED_VERTICAL_SLOW_MIN + Math.random() * (SPEED_VERTICAL_SLOW_MAX - SPEED_VERTICAL_SLOW_MIN);
  }
  if (r < 0.8) {
    return SPEED_VERTICAL_MEDIUM_MIN + Math.random() * (SPEED_VERTICAL_MEDIUM_MAX - SPEED_VERTICAL_MEDIUM_MIN);
  }
  return SPEED_VERTICAL_FAST_MIN + Math.random() * (SPEED_VERTICAL_FAST_MAX - SPEED_VERTICAL_FAST_MIN);
}

const HORIZONTAL_Y_BANDS = 4;
const VERTICAL_X_BANDS = 5;

function createHorizontalTraces(w: number, h: number): ProjectileData[] {
  const list: ProjectileData[] = [];
  const yMin = h * 0.1;
  const yMax = h * 0.9;
  const yBandHeight = (yMax - yMin) / HORIZONTAL_Y_BANDS;

  for (let i = 0; i < HORIZONTAL_TRACE_COUNT; i++) {
    const gfx = new Graphics();
    const len = 8 + Math.random() * 20;
    const isLight = Math.random() > 0.5;
    const color = isLight ? TRACE_COLOR_LIGHT : TRACE_COLOR_DARK;
    const alpha = isLight ? 0.45 + Math.random() * 0.2 : 0.35 + Math.random() * 0.2;
    gfx.rect(0, 0, len, TRACE_STROKE_WIDTH);
    gfx.fill({ color, alpha });

    const bandIndex = i % HORIZONTAL_Y_BANDS;
    const bandStart = yMin + bandIndex * yBandHeight;
    const jitter = Math.random() * yBandHeight * 0.85;
    const y = bandStart + jitter;

    const x = -w + Math.random() * (w * 2);
    const speedMagnitude = pickHorizontalSpeedMagnitude();
    const speedX = (Math.random() > 0.5 ? 1 : -1) * speedMagnitude;

    list.push({
      gfx,
      speedX,
      x,
      y,
      w: len,
    });
  }
  return list;
}

function createVerticalTraces(w: number, h: number): VerticalTraceData[] {
  const list: VerticalTraceData[] = [];
  const xBandWidth = w / VERTICAL_X_BANDS;

  for (let i = 0; i < VERTICAL_TRACE_COUNT; i++) {
    const gfx = new Graphics();
    const traceH = 18 + Math.random() * 55;
    const isLight = Math.random() > 0.5;
    const color = isLight ? TRACE_COLOR_LIGHT : TRACE_COLOR_DARK;
    const alpha = isLight ? 0.45 + Math.random() * 0.2 : 0.35 + Math.random() * 0.2;
    gfx.rect(0, 0, TRACE_STROKE_WIDTH, traceH);
    gfx.fill({ color, alpha });

    const bandIndex = i % VERTICAL_X_BANDS;
    const bandStart = bandIndex * xBandWidth;
    const jitter = Math.random() * xBandWidth * 0.85;
    const x = bandStart + jitter;

    const y = Math.random() * (h + traceH * 2) - traceH;
    const speedY = -pickVerticalSpeedMagnitude();

    list.push({
      gfx,
      x,
      y,
      height: traceH,
      speedY,
    });
  }
  return list;
}

function createGoldenWorm(
  w: number,
  h: number,
  initialX?: number,
  spawnDelay = 0
): GoldenWormData {
  const trailGfx = new Graphics();

  const x =
    initialX !== undefined
      ? initialX
      : w * 0.5 + (Math.random() - 0.5) * w * 0.2;
  const y = h + 30;
  const segmentLength =
    WORM_SEGMENT_VERTICAL_MIN +
    Math.random() * (WORM_SEGMENT_VERTICAL_MAX - WORM_SEGMENT_VERTICAL_MIN);

  return {
    trailGfx,
    trailPoints: [],
    x,
    y,
    phase: "up",
    directionX: Math.random() > 0.5 ? 1 : -1,
    segmentLength,
    segmentProgress: 0,
    spawnDelay,
  };
}

function drawWormTrail(worm: GoldenWormData) {
  const pts = worm.trailPoints;
  if (pts.length < 2) {
    worm.trailGfx.clear();
    return;
  }
  worm.trailGfx.clear();
  for (let i = 0; i < pts.length - 1; i++) {
    const t = pts.length > 1 ? i / (pts.length - 1) : 0;
    const alpha =
      WORM_TRAIL_ALPHA_OLD + (WORM_TRAIL_ALPHA_NEW - WORM_TRAIL_ALPHA_OLD) * t;
    worm.trailGfx.setStrokeStyle({
      width: WORM_STROKE_WIDTH,
      color: WORM_TRAIL_COLOR,
      alpha,
    });
    worm.trailGfx.moveTo(pts[i].x, pts[i].y);
    worm.trailGfx.lineTo(pts[i + 1].x, pts[i + 1].y);
    worm.trailGfx.stroke();
  }
}

export async function runMenuBackgroundScene(
  container: HTMLElement
): Promise<() => void> {
  const parent = container.parentElement;
  let w =
    container.clientWidth ||
    parent?.clientWidth ||
    window.innerWidth ||
    800;
  let h =
    container.clientHeight ||
    parent?.clientHeight ||
    window.innerHeight ||
    600;
  w = Math.max(1, w);
  h = Math.max(1, h);

  const app = new Application();
  await app.init({
    width: w,
    height: h,
    backgroundColor: BACKGROUND_COLOR,
    backgroundAlpha: 1,
    resolution: window.devicePixelRatio ?? 1,
    autoDensity: true,
  });

  const bgGfx = new Graphics();
  drawBackground(bgGfx, w, h);
  app.stage.addChild(bgGfx);

  const horizontalTraces = createHorizontalTraces(w, h);
  horizontalTraces.forEach(({ gfx }) => app.stage.addChild(gfx));

  const verticalTraces = createVerticalTraces(w, h);
  verticalTraces.forEach(({ gfx }) => app.stage.addChild(gfx));

  let sceneW = w;
  let sceneH = h;
  let elapsedTime = 0;
  const WORM_SPAWN_DELAY_MS = 1000;
  const goldenWorms: GoldenWormData[] = [
    createGoldenWorm(w, h, w * 0.25 + (Math.random() - 0.5) * w * 0.08, 0),
    createGoldenWorm(w, h, w * 0.5 + (Math.random() - 0.5) * w * 0.08, WORM_SPAWN_DELAY_MS),
    createGoldenWorm(w, h, w * 0.75 + (Math.random() - 0.5) * w * 0.08, WORM_SPAWN_DELAY_MS * 2),
  ];
  goldenWorms.forEach((worm) => {
    app.stage.addChild(worm.trailGfx);
  });

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS;

    horizontalTraces.forEach((p) => {
      p.x += p.speedX * dt;
      if (p.speedX > 0 && p.x > w + p.w) p.x = -p.w;
      if (p.speedX < 0 && p.x < -p.w) p.x = w + p.w;
      p.gfx.x = p.x;
      p.gfx.y = p.y;
    });

    verticalTraces.forEach((tr) => {
      tr.y += tr.speedY * dt;
      if (tr.y < -tr.height) {
        tr.y = h + tr.height;
      }
      tr.gfx.x = tr.x;
      tr.gfx.y = tr.y;
    });

    elapsedTime += dt;
    const dist = WORM_SPEED * dt;
    goldenWorms.forEach((worm) => {
      if (elapsedTime < worm.spawnDelay) return;
      if (worm.phase === "up") {
        worm.y += -dist;
        worm.segmentProgress += dist;
        if (worm.segmentProgress >= worm.segmentLength) {
          worm.phase = "horizontal";
          worm.segmentProgress = 0;
          worm.segmentLength =
            WORM_SEGMENT_HORIZONTAL_MIN +
            Math.random() *
              (WORM_SEGMENT_HORIZONTAL_MAX - WORM_SEGMENT_HORIZONTAL_MIN);
          worm.directionX = Math.random() > 0.5 ? 1 : -1;
        }
      } else {
        worm.x += worm.directionX * dist;
        worm.x = Math.max(20, Math.min(sceneW - 20, worm.x));
        worm.segmentProgress += dist;
        if (worm.segmentProgress >= worm.segmentLength) {
          worm.phase = "up";
          worm.segmentProgress = 0;
          worm.segmentLength =
            WORM_SEGMENT_VERTICAL_MIN +
            Math.random() *
              (WORM_SEGMENT_VERTICAL_MAX - WORM_SEGMENT_VERTICAL_MIN);
        }
      }

      worm.trailPoints.push({ x: worm.x, y: worm.y });
      if (worm.trailPoints.length > WORM_TRAIL_MAX_POINTS) {
        worm.trailPoints.shift();
      }
      drawWormTrail(worm);

      if (worm.y < -30) {
        worm.y = sceneH + 30;
        worm.x = sceneW * 0.5 + (Math.random() - 0.5) * sceneW * 0.2;
        worm.trailPoints.length = 0;
        worm.phase = "up";
        worm.segmentProgress = 0;
        worm.segmentLength =
          WORM_SEGMENT_VERTICAL_MIN +
          Math.random() *
            (WORM_SEGMENT_VERTICAL_MAX - WORM_SEGMENT_VERTICAL_MIN);
      }
    });
  });

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    const safeW = Math.max(1, width);
    const safeH = Math.max(1, height);
    sceneW = safeW;
    sceneH = safeH;
    app.renderer.resize(safeW, safeH);
    drawBackground(bgGfx, safeW, safeH);

    goldenWorms.forEach((worm) => {
      drawWormTrail(worm);
      if (worm.y > safeH + 30 || worm.y + 30 < 0) {
        worm.y = safeH + 30;
        worm.x = safeW * 0.5 + (Math.random() - 0.5) * safeW * 0.2;
        worm.trailPoints.length = 0;
      }
    });
  });
  resizeObserver.observe(container);

  container.appendChild(app.canvas);

  return () => {
    resizeObserver.disconnect();
    app.destroy(true, { children: true, texture: false });
    container.innerHTML = "";
  };
}
