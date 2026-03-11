import { Application, Container, Ticker } from 'pixi.js'
import { PlacementConfig, PlacementLayer } from '@/Game/Placement'
import { CharactersLayer } from '@/Game/Character'
import { COLS, ROWS, SCREEN, TILE_INCREMENT } from './common'
import { MapRender, TowerPreview } from '@/Game/Render'
import SoundLayer from '@/common/sound'
import { useGameStore } from '@/Game/common/stores/state'
import { SoundGroups } from '@/common/enum/sound-groups'
import { BlizzardPreview } from '@/Game/Skills/Blizzard'
import { MonsterConfig } from './common'

const { setPreviewTower, setSelectedTowerType, setGameController, setPause } =
  useGameStore.getState()

export class GameController extends Container {
  private countdownId: ReturnType<typeof setInterval> | null = null
  private mapLayer = new PlacementLayer()
  private mapRender: MapRender
  private charactersLayer: CharactersLayer
  private previewTower: TowerPreview = new TowerPreview(this, this.mapLayer)
  private blizzardPreview: BlizzardPreview
  private unsubscribeActiveSkill: (() => void) | null = null

  constructor(private app: Application, map: PlacementConfig) {
    super()
    this.x = -SCREEN.TILE_SIZE + (TILE_INCREMENT * ROWS * 2)
    this.y = -SCREEN.TILE_SIZE

    this.mapRender = new MapRender({
      tileTint: map.tileTint,
      dirtTint: map.dirtTint
    })
    this.charactersLayer = new CharactersLayer(this.mapLayer, map)
    this.previewTower.alpha = 0.5
    this.previewTower.visible = false
    setPreviewTower(this.previewTower)

    this.blizzardPreview = new BlizzardPreview()
    this.blizzardPreview.visible = false

    this.app.stage.addChild(this)
    this.app.stage.addChild(this.previewTower)
    this.addChild(this.mapRender)
    this.addChild(this.charactersLayer)
    this.addChild(this.blizzardPreview)
    this.addChild(this.mapRender.skillVerticesOverlayRoot)
    this.pauseOnGetout = this.pauseOnGetout.bind(this)

    this.mapLayer.setupPlaceTowers(
      this.previewTower,
      this.charactersLayer,
      this.mapRender
    )
    this.mapLayer.setupSkillOverlay(
      this.blizzardPreview,
      this.charactersLayer,
      this.mapRender
    )

    setGameController(this)
    this.setupVisibilityChangeEvent()
    this.subscribeActiveSkill()
  }

  getCurrentMapId(): number {
    return this.charactersLayer.getMapId()
  }

  getNextWaveConfig(): MonsterConfig | null {
    return this.charactersLayer.getNextWaveConfig()
  }

  sendNextWave(): void {
    this.charactersLayer.spawnMonsters()
  }

  startCountdown() {
    if (this.countdownId) return

    this.countdownId = setInterval(() => {
      const { countdown, decrementCountdown } = useGameStore.getState()

      if (countdown <= 1) {
        this.charactersLayer.spawnMonsters()
      } else {
        decrementCountdown()
      }
    }, 1000)
  }

  stopCountdown() {
    if (this.countdownId) clearInterval(this.countdownId)
    this.countdownId = null
  }

  public setupVisibilityChangeEvent() {
    document.addEventListener('visibilitychange', this.pauseOnGetout)
  }

  private pauseOnGetout() {
    const { pause } = useGameStore.getState()

    if (document.visibilityState === 'hidden') this.stopCountdown()
    if (document.visibilityState === 'visible' && !pause) this.startCountdown()
  }

  pauseGame() {
    this.charactersLayer.onPauseGame()
    this.stopCountdown()
    setPause(true)
    this.app.ticker.stop()
    Ticker.shared.stop()
    SoundLayer.pauseGroup(SoundGroups.Monsters)
  }

  destroyGame() {
    this.pauseGame()
    this.stopCountdown()
    this.charactersLayer.destroyGame()
    this.mapRender.destroyGame()
    this.destroy()
  }

  resumeGame() {
    this.charactersLayer.onResumeGame()
    this.startCountdown()
    setPause(false)
    this.app.ticker.start()
    Ticker.shared.start()
    SoundLayer.resumeGroup(SoundGroups.Monsters)
  }

  togglePause() {
    const { pause } = useGameStore.getState()

    if (!pause) return this.pauseGame()
    return this.resumeGame()
  }

  public override destroy() {
    this.stopCountdown()
    this.unsubscribeActiveSkill?.()
    document.removeEventListener('visibilitychange', this.pauseOnGetout)
    document.removeEventListener('keydown', this.handleSkillKeydown)
    super.destroy()
  }

  private handleSkillKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      useGameStore.getState().setActiveSkill(null)
    }
  }

  private subscribeActiveSkill() {
    this.unsubscribeActiveSkill = useGameStore.subscribe(() => {
      const { activeSkill } = useGameStore.getState()
      const isBlizzard = activeSkill === 'blizzard'
      this.blizzardPreview.visible = isBlizzard
      this.mapRender.skillVerticesOverlayRoot.eventMode = isBlizzard
        ? 'static'
        : 'none'
      document.removeEventListener('keydown', this.handleSkillKeydown)
      if (isBlizzard) {
        document.addEventListener('keydown', this.handleSkillKeydown)
      }
    })
  }

  gridResize() {
    SCREEN.updateDimensions()

    this.x = (SCREEN.WIDTH - SCREEN.TILE_SIZE * COLS) / 2
    this.y = (SCREEN.HEIGHT - SCREEN.TILE_SIZE * ROWS) / 2

    this.mapRender.reDraw()
    this.addChild(this.mapRender.skillVerticesOverlayRoot)
    this.charactersLayer.reDraw()
    this.previewTower.visible = false
    this.blizzardPreview.visible = false
    useGameStore.getState().setActiveSkill(null)
    this.mapLayer.setupPlaceTowers(
      this.previewTower,
      this.charactersLayer,
      this.mapRender
    )
    this.mapLayer.setupSkillOverlay(
      this.blizzardPreview,
      this.charactersLayer,
      this.mapRender
    )

    setSelectedTowerType(null)
  }
}
