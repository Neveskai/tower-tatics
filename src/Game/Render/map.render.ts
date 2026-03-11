import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import { AssetsMap } from '@/common/assets/assets'
import { CENTER_ROW, COLS, ROWS, SCREEN } from '../common'

// eslint-disable-next-line
const TILE_ASSET_KEYS = [
  'tile',
  'tile-dirt',
  'tile-bump',
  'tile-straight',
  'tile-crossing',
  'tile-corner-square',
  'tile-corner-inner',
  'tile-corner-outer',
  'tile-corner-round',
]

type TileAssetKey = (typeof TILE_ASSET_KEYS)[number]

interface TileChoice {
  assetKey: TileAssetKey
  rotation: number
}

interface MapTheme {
  tileTint: number
  dirtTint: number
}

export class MapRender extends Container {
  tiles: Container[][] = []
  vertices: Container[][] = []
  skillVerticesOverlayRoot: Container = new Container()
  skillVerticesOverlay: Container[][] = []

  constructor(private theme: MapTheme) {
    super()
    this.drawGrid()
    this.drawVertices()
    this.drawSkillVerticesOverlay()
  }

  reDraw() {
    if (this.skillVerticesOverlayRoot.parent) {
      this.skillVerticesOverlayRoot.parent.removeChild(
        this.skillVerticesOverlayRoot
      )
    }
    this.skillVerticesOverlayRoot.destroy({ children: true })
    this.drawSkillVerticesOverlay()

    this.removeChildren()
    this.drawGrid()
    this.drawVertices()
  }

  public destroyGame() {
    this.children.forEach(child => child.destroy())
    this.destroy()
  }

  private isPortalEntranceTile(row: number, col: number): boolean {
    const inSpawnRows = row >= CENTER_ROW && row < CENTER_ROW + 6
    return (
      (col === 1 && inSpawnRows) ||
      (col === COLS - 2 && inSpawnRows)
    )
  }

  private getTileChoice(row: number, col: number): TileChoice {
    if (this.isPortalEntranceTile(row, col)) {
      return { assetKey: 'tile-dirt', rotation: 0 }
    }
    return { assetKey: 'tile', rotation: 0 }
  }

  private drawGrid() {
    const tileSize = SCREEN.TILE_SIZE

    for (let row = 0; row < ROWS; row++) {
      this.tiles[row] = []
      for (let col = 0; col < COLS; col++) {
        const isBorder = this.isGridBorder(row, col)

        const cell = new Container()
        cell.x = col * tileSize
        cell.y = row * tileSize

        if (isBorder) {
          cell.visible = false
        } else {
          const { assetKey, rotation } = this.getTileChoice(row, col)
          const tileAsset = AssetsMap[assetKey as keyof typeof AssetsMap]
          const tileTexture = Texture.from(tileAsset.alias)

          const sprite = new Sprite(tileTexture)
          sprite.anchor.set(0.5, 0.5)
          sprite.x = tileSize / 2 
          sprite.y = tileSize / 2
          sprite.width = tileSize
          sprite.height = tileSize
          sprite.rotation = rotation

          if (assetKey === 'tile') {
            sprite.tint = this.theme.tileTint
          } else if (assetKey === 'tile-dirt') {
            sprite.tint = this.theme.dirtTint
          }

          cell.addChild(sprite)
        }

        this.tiles[row][col] = cell
        this.addChild(cell)
      }
    }
  }

  private drawVertices() {
    for (let row = 0; row < ROWS; row++) {
      this.vertices[row] = []
      for (let col = 0; col < COLS; col++) {
        const isBorder = this.isVerticeBorder(row, col)

        if (isBorder) continue

        const vertice = new Container()

        const hitArea = new Graphics()
        hitArea
          .rect(0, 0, SCREEN.TILE_SIZE * 0.95, SCREEN.TILE_SIZE * 0.95)
          .fill({ color: 0xffffff, alpha: 0 })

        vertice.addChild(hitArea)
        vertice.x = col * SCREEN.TILE_SIZE - SCREEN.TILE_SIZE * 0.5
        vertice.y = row * SCREEN.TILE_SIZE - SCREEN.TILE_SIZE * 0.5

        vertice.eventMode = 'static'
        vertice.cursor = 'pointer'

        this.vertices[row][col] = vertice
        this.addChild(vertice)
      }
    }
  }

  private drawSkillVerticesOverlay() {
    this.skillVerticesOverlayRoot = new Container()
    this.skillVerticesOverlayRoot.eventMode = 'none'
    this.skillVerticesOverlay = []

    for (let row = 0; row < ROWS; row++) {
      this.skillVerticesOverlay[row] = []
      for (let col = 0; col < COLS; col++) {
        const isBorder = this.isVerticeBorder(row, col)

        if (isBorder) continue

        const vertice = new Container()

        const hitArea = new Graphics()
        hitArea
          .rect(0, 0, SCREEN.TILE_SIZE * 0.95, SCREEN.TILE_SIZE * 0.95)
          .fill({ color: 0xffffff, alpha: 0 })

        vertice.addChild(hitArea)
        vertice.x = col * SCREEN.TILE_SIZE - SCREEN.TILE_SIZE * 0.5
        vertice.y = row * SCREEN.TILE_SIZE - SCREEN.TILE_SIZE * 0.5

        vertice.eventMode = 'static'
        vertice.cursor = 'pointer'

        this.skillVerticesOverlay[row][col] = vertice
        this.skillVerticesOverlayRoot.addChild(vertice)
      }
    }
  }

  public isGridBorder(row: number, col: number) {
    const isBorder =
      row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1

    return isBorder
  }

  public isVerticeBorder(row: number, col: number) {
    const isBorder =
      row === 0 ||
      col === 1 ||
      row === ROWS - 1 ||
      col === 0 ||
      row === 1 ||
      col === COLS - 1

    return isBorder
  }
}
