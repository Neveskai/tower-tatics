import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import { COLS, ROWS, SCREEN } from '@/Game/common'
import { BLIZZARD_SIZE } from './blizzard-constants'

const FROST_COLOR = 0xaaddff
const FROST_ALPHA_BASE = 0.3
const PULSE_SPEED = 0.0015
const PULSE_RANGE = 0.12

const SNOW_COUNT = 42
const SNOW_FALL_SPEED_BASE = 0.08
const SNOW_DRIFT_MAX = 14
const SNOW_SCALE_MIN = 0.25
const SNOW_SCALE_MAX = 0.7
const SNOW_ALPHA_MIN = 0.5
const SNOW_ALPHA_MAX = 0.95
const SNOW_ROTATION_SPEED = 0.8

const FADE_IN_RATIO = 0.08
const FADE_OUT_RATIO = 0.08

interface SnowFlake {
  sprite: Sprite
  speedY: number
  drift: number
  rotationSpeed: number
}

export class BlizzardZoneVisual extends Container {
  private frostGfx: Graphics
  private snowContainer: Container
  private snowflakes: SnowFlake[] = []
  private pulsePhase = 0
  private centerRow: number
  private centerCol: number
  private zoneW: number
  private zoneH: number
  private durationMs: number
  private elapsedMs = 0

  constructor(centerRow: number, centerCol: number, durationMs: number) {
    super()
    this.centerRow = centerRow
    this.centerCol = centerCol

    const half = Math.floor(BLIZZARD_SIZE / 2)
    this.position.set(
      (centerCol - half) * SCREEN.TILE_SIZE,
      (centerRow - half) * SCREEN.TILE_SIZE
    )

    this.zoneW = BLIZZARD_SIZE * SCREEN.TILE_SIZE
    this.zoneH = BLIZZARD_SIZE * SCREEN.TILE_SIZE
    this.durationMs = durationMs

    this.frostGfx = new Graphics()
    this.addChild(this.frostGfx)

    this.snowContainer = new Container()
    this.addChild(this.snowContainer)

    this.drawFrost()

    const snowTexture = Texture.from('snowflake')
    for (let i = 0; i < SNOW_COUNT; i++) {
      const sprite = new Sprite(snowTexture)
      const scale =
        SNOW_SCALE_MIN + Math.random() * (SNOW_SCALE_MAX - SNOW_SCALE_MIN)
      sprite.anchor.set(0.5)
      sprite.scale.set(scale)
      sprite.alpha = SNOW_ALPHA_MIN + Math.random() * (SNOW_ALPHA_MAX - SNOW_ALPHA_MIN)
      sprite.position.set(Math.random() * this.zoneW, Math.random() * this.zoneH)

      this.snowContainer.addChild(sprite)
      this.snowflakes.push({
        sprite,
        speedY: (0.7 + Math.random() * 0.6) * SCREEN.TILE_SIZE * SNOW_FALL_SPEED_BASE,
        drift: (Math.random() - 0.5) * 2 * SNOW_DRIFT_MAX,
        rotationSpeed: (Math.random() - 0.5) * 2 * SNOW_ROTATION_SPEED,
      })
    }
  }

  private drawFrost(): void {
    this.frostGfx.clear()
    const tileSize = SCREEN.TILE_SIZE
    const half = Math.floor(BLIZZARD_SIZE / 2)
    for (let r = 0; r < BLIZZARD_SIZE; r++) {
      for (let c = 0; c < BLIZZARD_SIZE; c++) {
        const gridRow = this.centerRow - half + r
        const gridCol = this.centerCol - half + c
        if (gridRow >= 0 && gridRow < ROWS && gridCol >= 0 && gridCol < COLS) {
          this.frostGfx.rect(c * tileSize, r * tileSize, tileSize, tileSize)
        }
      }
    }
    this.frostGfx.fill({
      color: FROST_COLOR,
      alpha: FROST_ALPHA_BASE + PULSE_RANGE * Math.sin(this.pulsePhase),
    })
  }

  /** Retorna 0..1: fade-in no início, 1 no meio, fade-out no fim. */
  private getFadeFactor(): number {
    const t = this.elapsedMs
    const d = this.durationMs
    const fadeIn = d * FADE_IN_RATIO
    const fadeOut = d * FADE_OUT_RATIO
    if (t <= fadeIn && fadeIn > 0) return t / fadeIn
    if (t >= d - fadeOut && fadeOut > 0) return (d - t) / fadeOut
    return 1
  }

  update(deltaMS: number): void {
    this.elapsedMs += deltaMS
    const deltaSec = deltaMS / 1000
    this.pulsePhase += PULSE_SPEED * deltaMS
    this.drawFrost()

    const fade = this.getFadeFactor()
    this.alpha = fade

    for (const flake of this.snowflakes) {
      flake.sprite.y += flake.speedY * deltaSec
      flake.sprite.x += flake.drift * deltaSec
      flake.sprite.rotation += flake.rotationSpeed * deltaSec

      if (flake.sprite.y >= this.zoneH) flake.sprite.y = 0
      if (flake.sprite.y < 0) flake.sprite.y = this.zoneH
      if (flake.sprite.x >= this.zoneW) flake.sprite.x -= this.zoneW
      if (flake.sprite.x < 0) flake.sprite.x += this.zoneW
    }
  }
}
