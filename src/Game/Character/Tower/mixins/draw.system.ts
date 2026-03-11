import {
  ColorMatrixFilter,
  Container,
  Graphics,
  Sprite,
  Texture,
} from "pixi.js";
import { COLORS } from "@/Game/Character/Tower/constants/tower-colors.constants";
import { SCREEN } from "@/Game/common";
import { MAX_TOWER_LEVEL } from "@/Game/common/constants/towers.constants";
import {
  AssetsMap,
  ROTATION_FRAMES,
  getTowerRotationFrameAliases
} from "@/common/assets/assets";
import { TowerCharacter } from "../tower.abstract";
import { BASE_WEAPON_SIZE } from "@/Game/Character/Tower/constants/tower-weapon-anchors.constants";
import { TowerTypes } from "@/common/enum";
import { Vec2 } from "@/Game/common/types/placement.types";

export class RenderSystem {
  public gfx: Graphics;
  public rangeGfx: Graphics;
  public baseSprite?: Sprite;
  public weaponSprite?: Sprite;
  public badgeContainer: Container;

  /** Current aim angle in radians (atan2(dy,dx)+π/2); null = no target, use frame 0. */
  public aimAngleRad: number | null = null;

  constructor(private tower: TowerCharacter) {
    this.gfx = new Graphics();
    this.rangeGfx = new Graphics();
    this.badgeContainer = new Container();

    this.tower.addChild(this.rangeGfx);
    this.tower.addChild(this.gfx);
    this.tower.addChild(this.badgeContainer);

    this.badgeContainer.zIndex = 10000;
  }

  private get tileSize(): number {
    return SCREEN.TILE_SIZE;
  }

  async loadTowerSprites(): Promise<void> {
    const width = this.tileSize * 2;
    const type = this.tower.getType() as TowerTypes;

    const frameAliases = getTowerRotationFrameAliases(type);
    const alias = frameAliases
      ? frameAliases[0]
      : (AssetsMap[type] as { alias: string }).alias;
    const weaponTexture = Texture.from(alias);

    this.baseSprite = new Sprite(weaponTexture);
    this.baseSprite.width = 0;
    this.baseSprite.height = 0;
    this.baseSprite.anchor.set(0.5);
    this.baseSprite.position.set(this.tileSize, this.tileSize);
    this.tower.addChild(this.baseSprite);

    const maxTex = Math.max(weaponTexture.width, weaponTexture.height);
    const scale = (width * BASE_WEAPON_SIZE) / (maxTex > 0 ? maxTex : 1);

    this.weaponSprite = new Sprite(weaponTexture);
    this.weaponSprite.scale.set(scale);
    this.weaponSprite.anchor.set(0.5, 0.65);
    this.weaponSprite.position.set(this.tileSize, this.tileSize);

    this.updateWeaponColor();

    this.tower.addChild(this.weaponSprite);
  }

  setAimAngle(rad: number | null): void {
    if (rad !== null) this.aimAngleRad = rad;
  }

  updateWeaponFrame(): void {
    if (!this.weaponSprite) return;

    const type = this.tower.getType() as TowerTypes;
    const frameAliases = getTowerRotationFrameAliases(type);

    if (frameAliases) {
      const angle = (this.aimAngleRad ?? 0) + Math.PI * 2;
      const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      
      let frameIndex =
        Math.round((normalized / (2 * Math.PI)) * ROTATION_FRAMES) % ROTATION_FRAMES;
      // Inverter índice para alinhar órbita da câmera (Blender) com direção da arma no jogo
      frameIndex = (ROTATION_FRAMES - 1 - frameIndex) % ROTATION_FRAMES;
      const alias = frameAliases[frameIndex];
      this.weaponSprite.texture = Texture.from(alias);
      this.weaponSprite.rotation = 0;
    } else {
      // Torres sem frames (Freeze, Anti_Air): rotação do sprite pelo mesmo ângulo
      this.weaponSprite.rotation = (this.aimAngleRad ?? 0) - Math.PI * 1.5;
    }
  }

  updateWeaponColor(): void {
    if (this.weaponSprite && this.baseSprite) {
      const { level } = this.tower;
      const color = COLORS.TowerEvolution[level - 1];
      this.weaponSprite.tint = color;
      this.baseSprite.tint = color;
    }

    this.drawBadges();
  }

  async reDraw(): Promise<void> {
    const width = this.tileSize * 2;
    const tile = this.getCurrentTilePosition();

    const offsetX = this.tower.x - tile.col * this.tower.previousTileSize;
    const offsetY = this.tower.y - tile.row * this.tower.previousTileSize;

    this.tower.x =
      tile.col * this.tileSize +
      (offsetX / this.tower.previousTileSize) * this.tileSize;
    this.tower.y =
      tile.row * this.tileSize +
      (offsetY / this.tower.previousTileSize) * this.tileSize;
    this.tower.previousTileSize = this.tileSize;
    this.tower.pivot.set(this.tileSize, this.tileSize);

    if (this.baseSprite) {
      this.baseSprite.width = 0;
      this.baseSprite.height = 0;
      this.baseSprite.position.set(this.tileSize, this.tileSize);
    }

    if (this.weaponSprite) {
      const maxTex = Math.max(
        this.weaponSprite.texture.width,
        this.weaponSprite.texture.height
      );
      const scale = (width * BASE_WEAPON_SIZE) / (maxTex > 0 ? maxTex : 1);
      this.weaponSprite.scale.set(scale);
      this.weaponSprite.anchor.set(0.5, 0.5);
      this.weaponSprite.position.set(this.tileSize, this.tileSize);
    }
  }

  paintColoredRect(type: TowerTypes): void {
    const width = this.tileSize * 2;
    const color = COLORS.Towers[type];
    this.gfx.beginPath();
    this.gfx.roundRect(0, 0, width, width, 6);
    this.gfx.fill({ color });
  }

  getCurrentTilePosition(): Vec2 {
    return {
      row: Math.round(this.tower.y / this.tileSize),
      col: Math.round(this.tower.x / this.tileSize),
    };
  }

  drawRangeIndicator(): void {
    const gfx = this.rangeGfx;
    const radius = this.tower.range * 0.91 * SCREEN.TILE_SIZE;
    const cx = SCREEN.TILE_SIZE;
    const cy = SCREEN.TILE_SIZE;

    gfx.clear();
    gfx.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.7 });

    const dashLength = 12;
    const gapLength = 8;
    const totalCircumference = 2 * Math.PI * radius;
    const segments = Math.floor(totalCircumference / (dashLength + gapLength));
    const step = (2 * Math.PI) / segments;

    gfx.beginPath();
    for (let i = 0; i < segments; i++) {
      const start = i * step;
      const end = start + step * (dashLength / (dashLength + gapLength));
      gfx.moveTo(cx + radius * Math.cos(start), cy + radius * Math.sin(start));
      gfx.lineTo(cx + radius * Math.cos(end), cy + radius * Math.sin(end));
    }

    gfx.stroke();
    this.drawCorners();
  }

  hideRangeIndicator(): void {
    this.rangeGfx.clear();
    if (this.weaponSprite) this.weaponSprite.filters = [];
  }

  drawCorners(): void {
    const size = SCREEN.TILE_SIZE * 2;
    const edgeLength = 8;
    const lineWidth = 2;
    const color = 0xffff00;
    const gfx = this.rangeGfx;

    const filter = new ColorMatrixFilter();
    filter.brightness(1.3, true);
    if (this.weaponSprite) this.weaponSprite.filters = [filter];

    const corners = [
      { x: 0, y: 0 },
      { x: size, y: 0 },
      { x: size, y: size },
      { x: 0, y: size },
    ];

    gfx.setStrokeStyle({ width: lineWidth, color, alpha: 0.8 });

    for (const { x, y } of corners) {
      gfx.beginPath();
      gfx.moveTo(x, y);
      gfx.lineTo(x + (x === 0 ? edgeLength : -edgeLength), y);
      gfx.moveTo(x, y);
      gfx.lineTo(x, y + (y === 0 ? edgeLength : -edgeLength));
      gfx.stroke();
    }
  }

  drawBadges(): void {
    const { level } = this.tower;
    const count = level === MAX_TOWER_LEVEL ? 3 : level - 1;

    if (!count) return;

    this.badgeContainer.removeChildren();

    const badgeTexture = Texture.from("badge-icon");
    const starTexture = Texture.from("star-icon");

    const baseX = SCREEN.TILE_SIZE * 1.58;
    const baseY = 5;

    if (level === MAX_TOWER_LEVEL) {
      const star = new Sprite(starTexture);

      star.position.set(baseX * 0.92, baseY);
      star.tint = 0xf0f000;
      star.width = 11.5;
      star.height = 11.5;

      this.badgeContainer.addChild(star);
    } else {
      for (let i = 0; i < count; i++) {
        const sprite = new Sprite(badgeTexture);

        sprite.width = 7.5;
        sprite.height = 4;
        sprite.position.set(baseX, baseY + i * 3);
        sprite.tint = 0xf0f000;

        this.badgeContainer.addChild(sprite);
      }
    }
  }

  updateOverheatVisual(): void {
    if (!this.weaponSprite) return;

    if (this.tower.isOverheated) {
      const filter = new ColorMatrixFilter();
      filter.tint(0xff3300);
      this.weaponSprite.filters = [filter];
      return;
    }

    this.weaponSprite.filters = [];
  }
}
