import { Container, Graphics } from 'pixi.js'
import { COLS, ROWS, SCREEN } from '@/Game/common'
import { BLIZZARD_SIZE } from './blizzard-constants'

const PREVIEW_COLOR = 0x88ccff
const PREVIEW_ALPHA = 0.4

/** Valid center range so the preview can touch map corners. Preview is drawn on all grid tiles (including borders) so it stays aligned with the grid. */
const HALF = Math.floor(BLIZZARD_SIZE / 2)
const MIN_CENTER = HALF
const MAX_CENTER_ROW = ROWS - 2 - HALF
const MAX_CENTER_COL = COLS - 2 - HALF

export class BlizzardPreview extends Container {
  private gfx: Graphics
  private centerRow = 0
  private centerCol = 0

  constructor() {
    super()
    this.gfx = new Graphics()
    this.addChild(this.gfx)
    this.visible = false
  }

  updateFromCenterRowCol(centerRow: number, centerCol: number): void {
    const row = Math.max(MIN_CENTER, Math.min(MAX_CENTER_ROW, centerRow))
    const col = Math.max(MIN_CENTER, Math.min(MAX_CENTER_COL, centerCol))
    this.centerRow = row
    this.centerCol = col

    this.position.set(
      (col - (BLIZZARD_SIZE - 1) / 2) * SCREEN.TILE_SIZE,
      (row - (BLIZZARD_SIZE - 1) / 2) * SCREEN.TILE_SIZE
    )

    this.gfx.clear()
    const tileSize = SCREEN.TILE_SIZE
    for (let r = 0; r < BLIZZARD_SIZE; r++) {
      for (let c = 0; c < BLIZZARD_SIZE; c++) {
        const gridRow = row - Math.floor(BLIZZARD_SIZE / 2) + r
        const gridCol = col - Math.floor(BLIZZARD_SIZE / 2) + c
        if (gridRow >= 0 && gridRow < ROWS && gridCol >= 0 && gridCol < COLS) {
          this.gfx.rect(c * tileSize, r * tileSize, tileSize, tileSize)
        }
      }
    }
    this.gfx.fill({ color: PREVIEW_COLOR, alpha: PREVIEW_ALPHA })
  }

  getCenter(): { row: number; col: number } {
    return { row: this.centerRow, col: this.centerCol }
  }
}
