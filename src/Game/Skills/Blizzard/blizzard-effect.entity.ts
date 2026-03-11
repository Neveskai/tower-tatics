import { SCREEN } from "@/Game/common";
import { CharactersLayer } from "@/Game/Character/character.layer";
import {
  BLIZZARD_DAMAGE_PER_TICK,
  BLIZZARD_SLOW_DURATION,
  BLIZZARD_SLOW_FACTOR,
  BLIZZARD_TICK_INTERVAL_MS,
} from "./blizzard-constants";
import { BlizzardZoneVisual } from "./blizzard-zone-visual.entity";
import { resolveDamage } from "@/Game/common/combat/damage.helpers";

export class BlizzardEffect {
  private endTime: number
  private lastTickTime: number
  private visual: BlizzardZoneVisual

  constructor(
    private charactersLayer: CharactersLayer,
    private centerRow: number,
    private centerCol: number,
    durationMs: number
  ) {
    this.endTime = performance.now() + durationMs
    this.lastTickTime = performance.now()
    this.visual = new BlizzardZoneVisual(centerRow, centerCol, durationMs)
    this.charactersLayer.addChildAt(this.visual, 0)
  }

  update(deltaMS: number): boolean {
    this.visual.update(deltaMS)
    const now = performance.now()
    if (now >= this.endTime) {
      this.visual.destroy({ children: true })
      return true
    }

    if (now - this.lastTickTime >= BLIZZARD_TICK_INTERVAL_MS) {
      this.lastTickTime = now
      const centerX = (this.centerCol + 0.5) * SCREEN.TILE_SIZE
      const centerY = (this.centerRow + 0.5) * SCREEN.TILE_SIZE
      const radius = 5.5 * SCREEN.TILE_SIZE
      const monsters = this.charactersLayer.getEnemiesInRange(
        centerX,
        centerY,
        radius,
        true,
        true
      )
      for (const monster of monsters) {
        if (monster.isAlive) {
          monster.applySlow(BLIZZARD_SLOW_FACTOR, BLIZZARD_SLOW_DURATION);
          const effectiveDamage = resolveDamage(BLIZZARD_DAMAGE_PER_TICK);
          if (effectiveDamage > 0) monster.takeDamage(effectiveDamage);
        }
      }
    }
    return false
  }

  destroy(): void {
    if (this.visual && !this.visual.destroyed) {
      this.visual.destroy({ children: true })
    }
  }
}
