import { TowerCharacter } from "@/Game/Character/Tower";
import { AssetsMap } from "@/common/assets/assets";
import { TowerAvatar } from "../TowerAvatar/tower-avatar.component";
import css from "./tower-img-container.module.css";
import { UpgradeAnimation, UpgradeState } from "@/common/ui";

export function TowerImgContainer({
  box,
  tower,
  canvas,
  progress,
  weaponStyle,
  imageContainerStyle,
}: {
  box?: boolean;
  tower: TowerCharacter;
  canvas?: boolean;
  progress?: UpgradeState;
  weaponStyle?: React.CSSProperties;
  imageContainerStyle?: React.CSSProperties;
}) {
  const weaponAssetKey = tower.level ? tower.getType() : null;
  const keyForAsset =
    weaponAssetKey != null ? String(weaponAssetKey).replace(/_/g, "-") : null;
  const weaponAsset =
    keyForAsset != null
      ? AssetsMap[keyForAsset as keyof typeof AssetsMap]
      : undefined;

  return (
    <div className={box ? css.boxContainer : ""}>
      <div className={css.imageContainer} style={imageContainerStyle}>
        {!!tower.level && !progress?.isUpgrading && !canvas && weaponAsset && (
          <img
            src={weaponAsset.src}
            alt={`${tower.getType()} Tower`}
            className={css.weaponImage}
            style={weaponStyle}
          />
        )}

        {!!tower.level && canvas && (
          <TowerAvatar tower={tower} isUpgrading={progress?.isUpgrading} />
        )}
      </div>

      {progress?.isUpgrading && canvas && <UpgradeAnimation state={progress} />}
    </div>
  );
}
