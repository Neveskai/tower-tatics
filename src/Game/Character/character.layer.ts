import {
  CENTER_ROW,
  COLS,
  ROWS,
  SCREEN,
} from '@/Game/common'
import { Container, Ticker } from 'pixi.js'
import { PlacementConfig, PlacementLayer } from '@/Game/Placement'
import { Vec2 } from "@/Game/common/types/placement.types";
import { MonsterCharacter } from '@/Game/Character/Monster'
import { Quadtree } from './Monster/helpers/quad-tree'
import { MonsterConfig } from '@/Game/common/types/monsters.types'
import { renderGameOverScreen } from '@/Game/screen/GameOverScreen/game-over-screen'
import { createTower, TowerCharacter } from './Tower'
import { useGameStore } from '@/Game/common/stores/state'
import { renderMissionCompleteScreen } from '@/Game/screen/MissionCompleteScreen'
import { recordKill, recordWave, recordTowerBuild } from '@/common/services/mission-engine/mission-events'
import { useGoldStore } from '@/Game/common/stores/gold'
import { HudModes } from '@/common/enum/hud-modes'
import { TowerTypes } from '@/common/enum/tower-types'
import { BlizzardEffect } from '@/Game/Skills/Blizzard'

export class CharactersLayer extends Container {
  private tickerCallback: (ticker: Ticker) => void
  private ticker: Ticker = Ticker.shared
  private towers: Set<TowerCharacter> = new Set()
  private monsters: Set<MonsterCharacter> = new Set()
  private blizzardEffects: BlizzardEffect[] = []
  private quad: Quadtree = new Quadtree({
    x: 0,
    y: 0,
    width: COLS * SCREEN.TILE_SIZE,
    height: ROWS * SCREEN.TILE_SIZE
  })

  private waveConfig: MonsterConfig

  constructor(private mapLayer: PlacementLayer, private map: PlacementConfig) {
    super()
    this.tickerCallback = ticker => this.updateAll(ticker)
    this.ticker.add(this.tickerCallback, this)

    this.waveConfig = this.map.waves[0]
  }

  public reDraw() {
    this.monsters.forEach(monster => monster.reDraw())
    this.towers.forEach(tower => tower.reDraw())
  }

  public getMapId(): number {
    return this.map.id
  }

  public getNextWaveConfig(): MonsterConfig | null {
    if (!this.map?.waves) return null
    const currentHorde = useGameStore.getState().currentHorde
    const wave = this.map.waves[currentHorde]
    return wave ?? null
  }

  public addBlizzardEffect(centerRow: number, centerCol: number, durationMs: number) {
    this.blizzardEffects.push(
      new BlizzardEffect(this, centerRow, centerCol, durationMs)
    )
  }

  public destroyGame() {
    this.ticker.remove(this.tickerCallback)
    this.ticker.destroy()
    this.blizzardEffects.forEach((e) => e.destroy())
    this.blizzardEffects = []
    this.monsters.forEach(monster => monster.onDestroy())
    this.towers.forEach(tower => tower.onDestroy())
    this.monsters.clear()
    this.towers.clear()
    this.destroy()
  }

  public addMonster(monster: MonsterCharacter) {
    this.addChild(monster)
    this.monsters.add(monster)
    useGameStore.getState().setHasActiveMonsters(true)
  }

  public setupMonster(monster: MonsterCharacter) {
    monster.goToAny(this.getRightPortalTiles())

    monster.once('reached-destination', () => this.onMonsterDeath(monster))
    monster.on('monster-died', () => this.onMonsterDeath(monster))
  }

  public removeMonster(monster: MonsterCharacter) {
    this.removeChild(monster)
    this.monsters.delete(monster)

    if (this.monsters.size === 0) {
      useGameStore.getState().setHasActiveMonsters(false)
    }
  }

  public spawnMonsters() {
    const {
      resetCountdown,
      incrementHorde,
      setIsSending,
      currentHorde,
      isSending
    } = useGameStore.getState()

    if (isSending) return

    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
    }, 5000)

    this.waveConfig = this.map.waves[currentHorde]

    const scheduleSpawns = (spawnFn: () => void) => {
      for (let i = 0; i < this.waveConfig.spawnPerSide; i++) {
        const delay = Math.random() * this.waveConfig.spawnDuration
        setTimeout(() => spawnFn(), delay)
      }
    }

    scheduleSpawns(() => this.spawnFromLeft(this.waveConfig))

    resetCountdown()
    incrementHorde()
    recordWave()

    this.towers.forEach(tower => {
      tower.statsTracker.hordeDamage = 0
    })
  }

  public onPauseGame() {
    const { setPauseStart } = useGameStore.getState()

    setPauseStart(performance.now() / 1000)
  }

  public onResumeGame() {
    const { pauseStart, setPauseStart } = useGameStore.getState()

    if (pauseStart !== null) {
      const now = performance.now() / 1000
      const pauseDuration = now - pauseStart

      this.monsters.forEach(monster => {
        if (monster.slowEffect.slowed) {
          monster.slowEffect.slowUntil += pauseDuration
        }

        if (monster.stunEffect.stunned) {
          monster.stunEffect.stunUntil += pauseDuration
        }
      })

      this.towers.forEach(tower => {
        if (tower.upgrader.isUpgrading) {
          tower.upgrader.upgradeTimer += pauseDuration
        }
      })

      setPauseStart(null)
    }
  }

  public getEnemiesInRange(
    x: number,
    y: number,
    radius: number,
    attackAir: boolean,
    attackTerrain: boolean
  ): MonsterCharacter[] {
    const range = {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2
    }

    const points = this.quad.query(range)

    return points
      .map(p => p.data as MonsterCharacter)
      .filter(monster => {
        if (monster.destroyed || !monster.parent) return false
        if (monster.isAir && !attackAir) return false
        if (monster.isTerrain && !attackTerrain) return false
        if (monster.isStealthActive) return false

        const dx = monster.x - x
        const dy = monster.y - y
        return dx * dx + dy * dy <= radius * radius
      })
  }

  public getLeftToRightPaths(): { start: Vec2; ends: Vec2[] }[] {
    const sources: Vec2[] = []
    const destinations = this.getRightPortalTiles()

    const startRow = Math.floor(ROWS / 2) - 2
    for (let i = 0; i < 6; i++) {
      sources.push({ row: startRow + i, col: 0 })
    }

    return sources.map(start => ({ start, ends: destinations }))
  }

  public createAndPlaceTower(row: number, col: number, towerType: TowerTypes) {
    const tower = createTower(this, towerType)

    this.towers.add(tower)
    tower.x = col * SCREEN.TILE_SIZE
    tower.y = row * SCREEN.TILE_SIZE

    this.mapLayer.placeTower(row, col)
    this.addChild(tower)
    recordTowerBuild(towerType)

    this.verifyPaths(tower)

    tower.once('tower-selled', () => {
      const store = useGameStore.getState()
      const tileRow = Math.round(tower.y / SCREEN.TILE_SIZE)
      const tileCol = Math.round(tower.x / SCREEN.TILE_SIZE)

      this.mapLayer.occupied[tileRow][tileCol] = false
      this.mapLayer.occupied[tileRow - 1][tileCol] = false
      this.mapLayer.occupied[tileRow][tileCol - 1] = false
      this.mapLayer.occupied[tileRow - 1][tileCol - 1] = false

      this.towers.delete(tower)
      this.monsters.forEach(monster => monster.recalcPath())
      store.setMode(HudModes.SHOP)
    })

    return tower
  }

  public verifyPaths(tower: TowerCharacter) {
    this.monsters.forEach(monster => monster.verifyPath(tower))
  }

  private spawnFromLeft(config: MonsterConfig) {
    const state = useGameStore.getState()
    const monster = new MonsterCharacter(this.mapLayer, config)
    const randomRow = Math.floor(Math.random() * 6)

    monster.x = 0
    monster.y = (CENTER_ROW + randomRow) * SCREEN.TILE_SIZE

    this.setupMonster(monster)
    this.addMonster(monster)

    if (!state.selectedMonster) state.setSelectedMonster(monster)
  }

  private getRightPortalTiles(): Vec2[] {
    const tiles: Vec2[] = []
    for (let i = 0; i < 6; i++) {
      tiles.push({ row: CENTER_ROW + i, col: COLS - 1 })
    }
    return tiles
  }

  private onMonsterDeath(monster: MonsterCharacter) {
    const {
      decrementPlayerHealth,
      setSelectedMonster,
      selectedMonster,
      playerHealth,
      currentHorde
    } = useGameStore.getState()

    if (monster.isAlive) {
      decrementPlayerHealth(5)

      if (playerHealth === 5) {
        renderGameOverScreen()
        return
      }

      if (monster.id === selectedMonster?.id) {
        setSelectedMonster(null)
      }
    } else {
      const { incrementPlayerGold } = useGoldStore.getState()
      incrementPlayerGold(monster.gold)
      recordKill()
    }

    this.removeMonster(monster)

    setTimeout(() => {
      monster.onDestroy()
    }, 1000)

    const isLastHorde = currentHorde + 1 > this.map.waves.length

    if (isLastHorde) {
      const { gameController } = useGameStore.getState()

      if (this.monsters.size === 0) {
        gameController?.pauseGame()
        renderMissionCompleteScreen(this.map.id)
      }
    }
  }

  private updateAll = (ticker: Ticker) => {
    this.quad.clear()

    this.monsters.forEach(monster => {
      if (monster && !monster.destroyed) {
        monster.update(ticker.deltaMS)

        if (monster.healer) {
          this.updateHealer(monster, ticker.deltaMS)
        }

        if (!monster?.x || !monster?.y) return

        this.quad.insert({ x: monster.x, y: monster.y, data: monster })
      }
    })

    this.blizzardEffects = this.blizzardEffects.filter((effect) => {
      const done = effect.update(ticker.deltaMS)
      return !done
    })
  }

  private updateHealer(monster: MonsterCharacter, deltaMs: number) {
    const HEAL_INTERVAL_MS = 1000
    const HEAL_RADIUS = SCREEN.TILE_SIZE * 3
    const HEAL_AMOUNT = 5

    monster.healerElapsedMs += deltaMs
    if (monster.healerElapsedMs < HEAL_INTERVAL_MS) return
    monster.healerElapsedMs = 0

    this.monsters.forEach(other => {
      if (other === monster) return
      if (!other.isAlive || other.destroyed || !other.parent) return
      if (other.currHealth >= other.maxHealth) return

      const dx = other.x - monster.x
      const dy = other.y - monster.y
      if (dx * dx + dy * dy > HEAL_RADIUS * HEAL_RADIUS) return

      const newHealth = Math.min(other.maxHealth, other.currHealth + HEAL_AMOUNT)
      other.setHealth(newHealth)
    })
  }
}
