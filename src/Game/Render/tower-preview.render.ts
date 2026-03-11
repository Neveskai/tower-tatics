import { Container, Graphics, Sprite, Texture } from 'pixi.js'

import { GameController } from '@/Game/game.controller'
import { PlacementLayer } from '@/Game/Placement'
import { CharactersLayer } from '@/Game/Character'
import { Vec2 } from "@/Game/common/types/placement.types";
import { useCatalogStore } from '@/common/stores/catalog/catalog.store'
import { SCREEN } from '../common'
import { AssetsMap } from '@/common/assets/assets'
import { BASE_WEAPON_SIZE } from '@/Game/Character/Tower/constants/tower-weapon-anchors.constants'
import SoundLayer from '@/common/sound'
import { showFloatingText } from '@/Game/Text/text.layer'
import { GOLD_LACK_TEXT } from '@/Game/Text/tower-text'
import { MapRender } from './map.render'
import { useGameStore } from '@/Game/common/stores/state'
import { useGoldStore } from '@/Game/common/stores/gold'
import { SoundGroups } from '@/common/enum/sound-groups'
import { TowerTypes } from '@/common/enum'

export class TowerPreview extends Container {
  gfx: Graphics
  type: TowerTypes
  rangeGfx: Graphics
  baseSprite?: Sprite
  weaponSprite?: Sprite

  currPos: Vec2 = { row: 0, col: 0 }

  private range: number = 3

  constructor(
    private gameController: GameController,
    private mapLayer: PlacementLayer,
    type: TowerTypes = TowerTypes.MACHINE_GUN
  ) {
    super()
    this.type = type
    this.gfx = new Graphics()
    this.rangeGfx = new Graphics()
    this.addChild(this.rangeGfx)
    this.addChild(this.gfx)
  }

  get isNotCenteredWeapon() {
    return this.type === TowerTypes.MACHINE_GUN
  }

  setupTowerType() {
    const config = useCatalogStore.getState().getTowerConfig(this.type)
    this.range = config.range
  }

  async changeTower(type: TowerTypes) {
    this.type = type
    this.gfx.clear()
    this.rangeGfx.clear()
    this.pivot.set(SCREEN.TILE_SIZE, SCREEN.TILE_SIZE)

    if (this.weaponSprite) {
      this.removeChild(this.weaponSprite)
      this.weaponSprite.destroy()
      this.weaponSprite = undefined
    }

    if (this.baseSprite) {
      this.removeChild(this.baseSprite)
      this.baseSprite.destroy()
      this.baseSprite = undefined
    }

    this.setupTowerType()
    await this.loadTowerSprites()
    this.drawRangeIndicator()
  }

  async loadTowerSprites(): Promise<void> {
    const width = SCREEN.TILE_SIZE * 2
    const weaponAsset = AssetsMap[this.type as keyof typeof AssetsMap]
    if (!weaponAsset) return
    const weaponTexture = Texture.from(weaponAsset.alias)

    this.baseSprite = new Sprite(weaponTexture)
    this.baseSprite.width = 0
    this.baseSprite.height = 0
    this.baseSprite.anchor.set(0.5)
    this.baseSprite.position.set(SCREEN.TILE_SIZE, SCREEN.TILE_SIZE)
    this.addChild(this.baseSprite)

    const maxTex = Math.max(weaponTexture.width, weaponTexture.height)
    const scale = (width * BASE_WEAPON_SIZE) / (maxTex > 0 ? maxTex : 1)

    this.weaponSprite = new Sprite(weaponTexture)
    this.weaponSprite.scale.set(scale)
    this.weaponSprite.anchor.set(0.5, 0.5)
    this.weaponSprite.position.set(SCREEN.TILE_SIZE, SCREEN.TILE_SIZE)

    this.addChild(this.weaponSprite)
  }

  private paintPreviewColor(valid: 'green' | 'red') {
    const width = SCREEN.TILE_SIZE * 2
    this.gfx.clear()
    const color = valid === 'green' ? 0x00ff00 : 0xff0000
    this.gfx.beginPath()
    this.gfx.roundRect(0, 0, width, width, 6)
    this.gfx.fill({ color })
  }

  drawRangeIndicator(): void {
    const gfx = this.rangeGfx
    const radius = this.range * 0.91 * SCREEN.TILE_SIZE
    const cx = SCREEN.TILE_SIZE
    const cy = SCREEN.TILE_SIZE

    gfx.clear()
    gfx.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.6 })

    const dashLength = 12
    const gapLength = 8
    const totalCircumference = 2 * Math.PI * radius
    const segments = Math.floor(totalCircumference / (dashLength + gapLength))
    const step = (2 * Math.PI) / segments

    gfx.beginPath()
    for (let i = 0; i < segments; i++) {
      const start = i * step
      const end = start + step * (dashLength / (dashLength + gapLength))
      gfx.moveTo(cx + radius * Math.cos(start), cy + radius * Math.sin(start))
      gfx.lineTo(cx + radius * Math.cos(end), cy + radius * Math.sin(end))
    }

    gfx.stroke()
  }

  hideRangeIndicator(): void {
    this.rangeGfx.clear()
  }

  async handlePointerOver(row: number, col: number) {
    const { selectedTowerType } = useGameStore.getState()
    const { playerGold } = useGoldStore.getState()

    this.currPos = { row, col }
    if (!selectedTowerType) return

    const config = useCatalogStore.getState().getTowerConfig(selectedTowerType)

    const canPreviewPlace = this.mapLayer.canPlacePreviewTower(row, col)
    const towerCost = config.cost
    const hasEnoughGold = playerGold >= towerCost

    this.visible = true
    this.position.set(
      this.gameController.x + col * SCREEN.TILE_SIZE,
      this.gameController.y + row * SCREEN.TILE_SIZE
    )
    this.paintPreviewColor(canPreviewPlace && hasEnoughGold ? 'green' : 'red')
  }

  handlePointerOut() {
    this.visible = false
  }

  handlePointerDown(
    row: number,
    col: number,
    charactersLayer: CharactersLayer,
    mapRender: MapRender
  ) {
    const { selectedTowerType } = useGameStore.getState()
    const { playerGold, decrementPlayerGold } = useGoldStore.getState()

    if (!selectedTowerType) return

    const config = useCatalogStore.getState().getTowerConfig(selectedTowerType)
    const towerCost = config.cost
    const hasEnoughGold = playerGold >= towerCost

    if (hasEnoughGold && this.mapLayer.canPlacePreviewTower(row, col)) {
      decrementPlayerGold(towerCost)

      charactersLayer.createAndPlaceTower(row, col, selectedTowerType)

      SoundLayer.play(SoundGroups.Effects, { name: 'place-tower' })
    } else if (!hasEnoughGold) {
      SoundLayer.play(SoundGroups.Voices, { name: 'gold_lack' })

      showFloatingText(GOLD_LACK_TEXT, 1000, mapRender.vertices[row][col])
    }
  }
}
