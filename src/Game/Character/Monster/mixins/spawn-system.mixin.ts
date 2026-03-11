import { useGameStore } from "@/Game/common/stores/state";
import { MonsterCharacter } from "../monster.entity";
import { SCREEN } from "@/Game/common";
import { GameController } from "@/Game/game.controller";

export class SpawnSystem {
  public spawnIntervalId?: NodeJS.Timeout;

  constructor(private monster: MonsterCharacter) {
    if (this.monster.config?.special?.spawnsPerTime) this.initSpawnsPerTime();
  }

  public onDeathCallbacks() {
    if (this.spawnIntervalId) clearInterval(this.spawnIntervalId);

    this.onDeathSpecial();
  }

  private initSpawnsPerTime() {
    const { gameController } = useGameStore.getState();

    if (!gameController) return;
    if (!this.monster.config?.special?.spawnsPerTime) return;

    this.spawnIntervalId = setInterval(() => {
      this.spawnchildren(gameController);
    }, 10000);
  }

  private spawnchildren(gameController: GameController) {
    if (!this.monster.config?.special?.spawnsPerTime) return;

    const spawnsPerTime = this.monster.config?.special?.spawnsPerTime;
    const charactersLayer = gameController["charactersLayer"];

    for (const monsterConfig of spawnsPerTime) {
      const possiblePositions: { row: number; col: number }[] = [];

      const baseRow = this.monster.movementSys.currPos?.row || 0;
      const baseCol = this.monster.movementSys.currPos?.col || 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const row = baseRow + dr;
          const col = baseCol + dc;

          if (!this.monster.mapLayer.occupied[row][col]) {
            possiblePositions.push({ row, col });
          }
        }
      }

      if (possiblePositions.length > 0) {
        const chosen =
          possiblePositions[
            Math.floor(Math.random() * possiblePositions.length)
          ];

        const monster = new MonsterCharacter(
          this.monster.mapLayer,
          monsterConfig
        );

        monster.x = chosen.col * SCREEN.TILE_SIZE;
        monster.y = chosen.row * SCREEN.TILE_SIZE;

        charactersLayer.addMonster(monster);
        setTimeout(() => {
          charactersLayer.setupMonster(monster);
        });
      }
    }
  }

  private onDeathSpecial() {
    const spawnsOnDeath = this.monster.config?.special?.spawnsOnDeath;

    if (spawnsOnDeath) {
      const { gameController } = useGameStore.getState();

      if (!gameController) return;

      const charactersLayer = gameController["charactersLayer"];

      for (const monsterConfig of spawnsOnDeath) {
        const monster = new MonsterCharacter(
          this.monster.mapLayer,
          monsterConfig
        );

        monster.x = this.monster.x;
        monster.y = this.monster.y;

        charactersLayer.addMonster(monster);
        setTimeout(() => {
          charactersLayer.setupMonster(monster);
        }, 400);
      }
    }
  }
}
