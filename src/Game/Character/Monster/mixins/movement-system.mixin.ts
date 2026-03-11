import { Vec2 } from "@/Game/common/types/placement.types";
import { runPathfinding } from "@/Game/Placement/run-path-finding";
import { EMPTY_GRID, SCREEN } from "@/Game/common";
import { flattenGrid } from "@/Game/common/helpers/flatten-grid.helpers";
import { Direction } from "@/Game/common/types/animation.types";
import { MonsterCharacter } from "../monster.entity";
import { TowerCharacter } from "../../Tower";

export class MovementSystem {
  public currPos?: Vec2;
  private destinationTiles?: Vec2[];
  public targetPath: Vec2[] = [];
  private targetPathLengthInitial: number = 0;
  private targetPathMap?: Set<string>;
  public lastDirection?: Direction;

  constructor(private monster: MonsterCharacter) {}

  public update(deltaMS: number): void {
    if (!this.currPos) return;
    if (this.monster.stunEffect.stunned) return;

    const targetX = this.currPos.col * SCREEN.TILE_SIZE;
    const targetY = this.currPos.row * SCREEN.TILE_SIZE;
    const dx = targetX - this.monster.x;
    const dy = targetY - this.monster.y;
    const dist = Math.hypot(dx, dy);

    const pxPerMs = (this.monster.currentSpeed * SCREEN.TILE_SIZE) / 1000;
    const speed = pxPerMs * deltaMS;

    if (dist < speed) {
      this.monster.x = targetX;
      this.monster.y = targetY;
      this.setNextTarget();
      return;
    }

    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;
    
    this.monster.x += vx;
    this.monster.y += vy;

    const direction = this.getDirectionFromDelta(vx, vy);

    if (this.lastDirection !== direction) {
      this.monster.direction = direction;
      this.lastDirection = direction;
      this.monster.setWalkAnimation();
    }
  }

  public async goToAny(targets: Vec2[]): Promise<void> {
    if (!this.monster.isAlive) return;

    const start = this.getCurrentTilePosition();

    let bestPath: Vec2[] = [];
    let bestDist = Infinity;
    this.destinationTiles = targets;

    const grid = this.monster.isAir
      ? EMPTY_GRID
      : this.monster.mapLayer.occupied;

    const { obstacleMap, width, height } = flattenGrid(grid);

    for (const target of targets) {
      const path = await runPathfinding({
        startRow: start.row,
        startCol: start.col,
        endRow: target.row,
        endCol: target.col,
        obstacleMap,
        width,
        height,
      });

      if (path.length > 0 && path.length < bestDist) {
        bestDist = path.length;
        bestPath = path;
      }
    }

    if (bestPath.length === 0) return;
    if (!this.monster.isAlive) return;

    this.targetPath = bestPath;

    if (!this.targetPathLengthInitial) {
      this.targetPathLengthInitial = bestPath.length;
    }

    this.targetPath.shift();
    this.setNextTarget();
  }

  public verifyPath(tower: TowerCharacter): void {
    if (!this.destinationTiles) return;
    if (!this.monster.isAlive) return;

    this.targetPathMap = new Set(
      this.targetPath.map((p) => `${p.row},${p.col}`)
    );

    const towerRow = Math.floor(tower.y / SCREEN.TILE_SIZE) - 1;
    const towerCol = Math.floor(tower.x / SCREEN.TILE_SIZE) - 1;
    const towerTiles: Vec2[] = [
      { row: towerRow, col: towerCol },
      { row: towerRow + 1, col: towerCol },
      { row: towerRow, col: towerCol + 1 },
      { row: towerRow + 1, col: towerCol + 1 },
    ];

    const pathBlocked = towerTiles.some((tile) =>
      this.targetPathMap?.has(`${tile.row},${tile.col}`)
    );

    if (pathBlocked) {
      this.goToAny(this.destinationTiles);
    }
  }

  public recalcPath(): void {
    if (!this.destinationTiles) return;
    this.goToAny(this.destinationTiles);
  }

  public getProgressToPortal(): number {
    return this.targetPathLengthInitial - this.targetPath.length;
  }

  private setNextTarget(): void {
    if (!this.monster.isAlive) return;

    if (this.currPos && !this.monster.isAir) {
      this.monster.mapLayer.unplaceMonster(
        this.currPos.row,
        this.currPos.col,
        this.monster
      );
    }

    this.currPos = this.targetPath.shift();

    if (this.currPos) {
      if (!this.monster.isAir) {
        this.monster.mapLayer.placeMonster(
          this.currPos.row,
          this.currPos.col,
          this.monster
        );
      }
    } else {
      this.monster.emit("reached-destination");
    }
  }

  private getCurrentTilePosition(): Vec2 {
    return {
      row: Math.round(this.monster.y / SCREEN.TILE_SIZE),
      col: Math.round(this.monster.x / SCREEN.TILE_SIZE),
    };
  }

  private getDirectionFromDelta(dx: number, dy: number): Direction {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "right" : "left";
    } else {
      return dy > 0 ? "down" : "up";
    }
  }

  public onDeathCallbacks() {
    if (this.currPos) {
      this.monster.mapLayer.unplaceMonster(
        this.currPos.row,
        this.currPos.col,
        this.monster
      );
    }

    this.targetPath = [];
    this.currPos = undefined;
  }
}
