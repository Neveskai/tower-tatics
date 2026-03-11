import { CharactersLayer } from '@/Game/Character'
import { MapRender, TowerPreview } from '@/Game/Render'
import { CENTER_ROW, COLS, ROWS } from '@/Game/common'
import { runPathfinding } from '@/Game/Placement/run-path-finding'
import { flattenGrid } from '@/Game/common/helpers/flatten-grid.helpers'
import { MonsterCharacter } from '@/Game/Character/Monster'
import { TowerCharacter } from '@/Game/Character/Tower'
import SoundLayer from '@/common/sound'
import { showFloatingText } from '../Text/text.layer'
import { CANT_BLOCK_PATH } from '@/Game/Text/tower-text'
import { useGameStore, isPausedMidWave, canInteractWithBoard } from '@/Game/common/stores/state'
import { useSkillEnergyStore } from '@/Game/common/stores/skill-energy/skill-energy.store'
import { SoundGroups } from '@/common/enum/sound-groups'
import { HudModes } from '@/common/enum/hud-modes'
import { Vec2 } from '@/Game/common/types/placement.types'
import { isNativePlatform } from '@/common/constants/responsivity.constants'
import { SKILL_COSTS } from '@/Game/common/constants/skills.constants'
import { BlizzardPreview } from '@/Game/Skills/Blizzard'
import { BLIZZARD_DURATION_MS } from '@/Game/Skills/Blizzard'

export class PlacementLayer {
  occupied: boolean[][] = []
  monstersOccupied: MonsterCharacter[][][] = []

  constructor() {
    this.setupOccupied()
  }

  public setupPlaceTowers(
    previewTower: TowerPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    if (isNativePlatform)
      return this.setupPlaceTowersMobile(
        previewTower,
        charactersLayer,
        mapRender
      )

    return this.setupPlaceTowersWeb(previewTower, charactersLayer, mapRender)
  }

  public setupSkillOverlay(
    blizzardPreview: BlizzardPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    if (isNativePlatform) {
      return this.setupSkillOverlayMobile(
        blizzardPreview,
        charactersLayer,
        mapRender
      )
    }
    return this.setupSkillOverlayWeb(
      blizzardPreview,
      charactersLayer,
      mapRender
    )
  }

  private setupSkillOverlayWeb(
    blizzardPreview: BlizzardPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    const vertices = mapRender.skillVerticesOverlay

    for (let row = 1; row < ROWS; row++) {
      for (let col = 1; col < COLS; col++) {
        const isBorder = mapRender.isVerticeBorder(row, col)
        if (isBorder) continue

        const vertice = vertices[row][col]

        vertice.on('pointermove', () => {
          const { activeSkill } = useGameStore.getState()
          if (activeSkill !== 'blizzard') return
          blizzardPreview.updateFromCenterRowCol(row, col)
        })

        vertice.on('pointerdown', (e) => {
          const { activeSkill, setActiveSkill } = useGameStore.getState()
          if (activeSkill !== 'blizzard') return
          if (e.button === 2) {
            setActiveSkill(null)
            return
          }
          if (e.button === 0) {
            const cost = SKILL_COSTS.blizzard
            const energyStore = useSkillEnergyStore.getState()
            if (!energyStore.canSpend(cost)) return
            charactersLayer.addBlizzardEffect(row, col, BLIZZARD_DURATION_MS)
            energyStore.spend(cost)
            setActiveSkill(null)
          }
        })
      }
    }
  }

  private setupSkillOverlayMobile(
    blizzardPreview: BlizzardPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    const vertices = mapRender.skillVerticesOverlay

    const confirmBlizzardPlacement = () => {
      const { activeSkill, setActiveSkill } = useGameStore.getState()

      if (!activeSkill) return

      const cost = SKILL_COSTS[activeSkill]
      const energyStore = useSkillEnergyStore.getState()

      if (!energyStore.canSpend(cost)) return

      const { row, col } = blizzardPreview.getCenter()

      charactersLayer.addBlizzardEffect(row, col, BLIZZARD_DURATION_MS)
      energyStore.spend(cost)
      setActiveSkill(null)
    }

    for (let row = 1; row < ROWS; row++) {
      for (let col = 1; col < COLS; col++) {
        const isBorder = mapRender.isVerticeBorder(row, col)
        if (isBorder) continue

        const vertice = vertices[row][col]

        vertice.on('touchstart', () => {
          const { activeSkill } = useGameStore.getState()

          if (!activeSkill) return

          blizzardPreview.updateFromCenterRowCol(row, col)
        })

        vertice.on('touchmove', () => {
          const { activeSkill } = useGameStore.getState()
          
          if (!activeSkill) return

          blizzardPreview.updateFromCenterRowCol(row, col)
        })

        vertice.on('touchend', () => {
          confirmBlizzardPlacement()
        })
      }
    }
  }

  private setupPlaceTowersWeb(
    previewTower: TowerPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    const vertices = mapRender.vertices

    for (let row = 1; row < ROWS; row++) {
      for (let col = 1; col < COLS; col++) {
        const isBorder = mapRender.isVerticeBorder(row, col)

        if (isBorder) continue

        const vertice = vertices[row][col]

        vertice.on('pointerover', () => {
          const store = useGameStore.getState()
          previewTower.currPos = { row, col }

          if (isPausedMidWave(store)) return

          previewTower.handlePointerOver(row, col)
        })

        vertice.on('pointerout', () => {
          const store = useGameStore.getState()
          if (isPausedMidWave(store) && !store.selectedTowerType) return

          previewTower.handlePointerOut()
        })

        vertice.on('pointerdown', async target => {
          const store = useGameStore.getState()
          if (isPausedMidWave(store)) return

          if (!(target instanceof TowerCharacter)) {
            if (store.selectedTower) {
              store.selectedTower.hideRangeIndicator()
              store.setSelectedTower(null)
            }
          }

          const paths = [
            ...charactersLayer.getLeftToRightPaths()
          ]

          const canPlace = await this.canPlaceTowerWithoutBlocking(
            row,
            col,
            paths
          )
          if (canPlace) {
            previewTower.handlePointerDown(row, col, charactersLayer, mapRender)
          } else {
            this.onSetTowerFail(row, col, mapRender)
          }
        })
      }
    }
  }

  private setupPlaceTowersMobile(
    previewTower: TowerPreview,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    const vertices = mapRender.vertices

    let isTouching = false
    let lastRow = -1
    let lastCol = -1

    const handleTouch = async (row: number, col: number) => {
      const store = useGameStore.getState()

      if (!canInteractWithBoard(store) || !store.selectedTowerType) return

      const paths = [
        ...charactersLayer.getLeftToRightPaths()
      ]

      const canPlace = await this.canPlaceTowerWithoutBlocking(row, col, paths)

      if (canPlace) {
        previewTower.handlePointerOver(row, col)
        lastRow = row
        lastCol = col
      } else {
        this.onSetTowerFail(row, col, mapRender)

        previewTower.handlePointerOut()
        lastRow = -1
        lastCol = -1
      }
    }

    const confirmPlacement = () => {
      if (lastRow >= 0 && lastCol >= 0) {
        previewTower.handlePointerDown(
          lastRow,
          lastCol,
          charactersLayer,
          mapRender
        )
        previewTower.handlePointerOut()
        lastRow = -1
        lastCol = -1
      }
    }

    for (let row = 1; row < ROWS; row++) {
      for (let col = 1; col < COLS; col++) {
        const isBorder = mapRender.isVerticeBorder(row, col)

        if (isBorder) continue

        const vertice = vertices[row][col]

        vertice.eventMode = 'static'
        vertice.cursor = 'pointer'
        vertice.on('touchstart', async () => {
          const store = useGameStore.getState()

          previewTower.currPos = { row, col }

          if (store.selectedTowerType) previewTower.visible = true
          if (isPausedMidWave(store)) return

          isTouching = true

          if (store.selectedTowerType) await handleTouch(row, col)
        })

        vertice.on('touchmove', async () => {
          const store = useGameStore.getState()

          if (!isTouching) return
          if (isPausedMidWave(store)) return

          if (store.selectedTowerType) await handleTouch(row, col)
        })

        vertice.on('touchend', async target => {
          const store = useGameStore.getState()

          if (!(target instanceof TowerCharacter)) {
            if (store.selectedTower) {
              store.selectedTower.hideRangeIndicator()
              if (!isNativePlatform) store.setSelectedTower(null)
            }
            if (isNativePlatform) store.setMode(HudModes.SHOP)
          }

          if (
            target instanceof TowerCharacter ||
            target instanceof MonsterCharacter
          ) {
            if (store.previewTower?.visible) {
              store.setSelectedTowerType(null)
              store.previewTower.visible = false
            }
          }

          await handleTouch(row, col)

          isTouching = false

          if (isPausedMidWave(store)) return

          confirmPlacement()
        })
      }
    }
  }

  public canPlacePreviewTower(vertexRow: number, vertexCol: number): boolean {
    if (vertexRow <= 0 || vertexCol <= 0) return false

    const positions = [
      [vertexRow, vertexCol],
      [vertexRow - 1, vertexCol],
      [vertexRow, vertexCol - 1],
      [vertexRow - 1, vertexCol - 1]
    ]

    for (const [r, c] of positions) {
      if (this.occupied[r][c] || this.monstersOccupied[r][c].length > 0) {
        return false
      }
    }

    return true
  }

  public async canPlaceTowerWithoutBlocking(
    vertexRow: number,
    vertexCol: number,
    paths: { start: Vec2; ends: Vec2[] }[]
  ): Promise<boolean> {
    if (vertexRow <= 0 || vertexCol <= 0) return false

    const towerTiles: Vec2[] = [
      { row: vertexRow, col: vertexCol },
      { row: vertexRow - 1, col: vertexCol },
      { row: vertexRow, col: vertexCol - 1 },
      { row: vertexRow - 1, col: vertexCol - 1 }
    ]

    for (const tile of towerTiles) {
      if (this.occupied[tile.row][tile.col]) return false
    }

    const simulated = this.occupied.map(r => [...r])
    for (const tile of towerTiles) {
      simulated[tile.row][tile.col] = true
    }

    const { obstacleMap, height, width } = flattenGrid(simulated)

    for (const { start, ends } of paths) {
      let hasPath = false
      for (const end of ends) {
        const path = await runPathfinding({
          startRow: start.row,
          startCol: start.col,
          endRow: end.row,
          endCol: end.col,
          obstacleMap,
          width,
          height
        })
        if (path.length > 0) {
          hasPath = true
          break
        }
      }
      if (!hasPath) return false
    }

    return true
  }

  public placeTower(row: number, col: number) {
    this.occupied[row][col] = true
    this.occupied[row - 1][col] = true
    this.occupied[row][col - 1] = true
    this.occupied[row - 1][col - 1] = true
  }

  public placeMonster(row: number, col: number, monster: MonsterCharacter) {
    this.monstersOccupied[row][col].push(monster)
  }

  public unplaceMonster(row: number, col: number, monster: MonsterCharacter) {
    const cell = this.monstersOccupied[row][col]
    const index = cell.indexOf(monster)
    if (index !== -1) {
      cell.splice(index, 1)
    }
  }

  private setupOccupied() {
    for (let row = 0; row < ROWS; row++) {
      this.occupied[row] = []
      this.monstersOccupied[row] = []

      for (let col = 0; col < COLS; col++) {
        const isBorder =
          row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1

        const isLeftPortal =
          col === 0 && row >= CENTER_ROW && row < CENTER_ROW + 6
        const isRightPortal =
          col === COLS - 1 && row >= CENTER_ROW && row < CENTER_ROW + 6

        const isLeftRightPortal = isLeftPortal || isRightPortal
        const isPortal = isLeftRightPortal

        this.occupied[row][col] = isBorder && !isPortal
        this.monstersOccupied[row][col] = isBorder
          ? [isBorder as unknown as MonsterCharacter]
          : []
      }
    }
  }

  private onSetTowerFail(row: number, col: number, mapRender: MapRender) {
    SoundLayer.play(SoundGroups.Voices, { name: 'i_cant' })

    showFloatingText(CANT_BLOCK_PATH, 1000, mapRender.vertices[row][col])
  }
}
