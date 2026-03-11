import { AnimatedSprite } from "pixi.js";
import { SCREEN } from "@/Game/common";
import { MonsterCharacter } from "../monster.entity";
import { monsterWalkAnimations } from "@/Game/Character/Monster/animations";

export class RenderSystem {
  public sprite?: AnimatedSprite;
  private previousTileSize = SCREEN.TILE_SIZE;

  constructor(private monster: MonsterCharacter) {}

  public setWalkAnimation(): void {
    if (this.sprite) {
      this.monster.removeChild(this.sprite);
      this.sprite.destroy();
    }

    this.sprite = monsterWalkAnimations[this.monster.type](
      this.monster.direction,
      this.monster.size
    );
    this.monster.addChild(this.sprite);
  }

  public reDraw(): void {
    if (!this.monster.movementSys.currPos) return;

    const tileScale = SCREEN.TILE_SIZE;
    const tile = this.getCurrentTilePosition();
    const offsetX = this.monster.x - tile.col * this.previousTileSize;
    const offsetY = this.monster.y - tile.row * this.previousTileSize;
    
    this.monster.x =
      tile.col * tileScale + (offsetX / this.previousTileSize) * tileScale;
    this.monster.y =
      tile.row * tileScale + (offsetY / this.previousTileSize) * tileScale;
    this.previousTileSize = tileScale;
  }

  private getCurrentTilePosition() {
    return {
      row: Math.round(this.monster.y / SCREEN.TILE_SIZE),
      col: Math.round(this.monster.x / SCREEN.TILE_SIZE),
    };
  }

  public getSprite(): AnimatedSprite | undefined {
    return this.sprite;
  }

  public setSprite(sprite: AnimatedSprite | undefined): void {
    this.sprite = sprite;
  }

  public onDeathCallbacks() {
    if (this.sprite) {
      this.monster.removeChild(this.sprite);
      this.sprite.destroy();
    }
  }
}
