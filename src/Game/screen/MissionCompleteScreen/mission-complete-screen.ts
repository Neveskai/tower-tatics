import { useGameStore } from "@/Game/common/stores/state";
import { navigate } from "@/common/functions/navigation";
import { usePlayerStore } from "@/common/stores/player/player.store";
import { useInventoryStore } from "@/common/stores/inventory/inventory.store";
import { recordMapComplete } from "@/common/services/mission-engine/mission-events";
import { getTowerUnlockForMap } from "@/common/constants/map-rewards.constants";
import { getFallbackTowerI18nKey } from "@/common/firestore/catalog/catalog.fallback";
import { getAssetUrl } from "@/common/assets/get-asset-url";
import i18n from "@/common/providers/i18n";
import { TowerTypes } from "@/common/enum/tower-types";
import type { MapWithUnlock } from "@/common/stores/player/player.types";

const TOWER_IMAGE_MAP: Record<TowerTypes, string> = {
  [TowerTypes.MACHINE_GUN]: "/assets/frames/towers/Machine_Gun.png",
  [TowerTypes.MISSILE]: "/assets/frames/towers/Cannon.png",
  [TowerTypes.HEAVY_GUN]: "/assets/frames/towers/Heavy_Gun.png",
  [TowerTypes.ELECTRIC]: "/assets/frames/towers/Electric.png",
  [TowerTypes.FREEZE]: "/assets/frames/towers/Freeze.png",
  [TowerTypes.ANTI_AIR]: "/assets/frames/towers/Anti_Air.png",
};

/**
 * Renders the mission complete overlay and grants rewards.
 * @param completedMapId - Id of the map that was just completed (from the game session).
 */
export async function renderMissionCompleteScreen(completedMapId: number) {
  const { gameController } = useGameStore.getState();
  const { selectedMapIndex, maps, unlockMap, setSelectedMapIndex } =
    usePlayerStore.getState();
  const { unlockTower } = useInventoryStore.getState();

  await recordMapComplete(completedMapId);

  const towerUnlocked = getTowerUnlockForMap(completedMapId);
  if (towerUnlocked) {
    await unlockTower(towerUnlocked);
  }

  const nextMapIndex = selectedMapIndex + 1;
  const hasNextMap = nextMapIndex < maps.length;
  if (hasNextMap) {
    unlockMap(maps[nextMapIndex].id);
  }

  gameController?.pauseGame();

  const nextMap: MapWithUnlock | null = hasNextMap ? maps[nextMapIndex] : null;
  const rewards = { nextMap, tower: towerUnlocked };

  const style = document.createElement("style");
  style.textContent = `
    @keyframes overlayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes starPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.95; }
    }
    #mission-complete-overlay {
      animation: overlayFadeIn 0.6s ease-out forwards;
      background: linear-gradient(180deg, rgba(40, 25, 0, 0.95) 0%, rgba(80, 50, 10, 0.95) 40%, rgba(60, 40, 5, 0.98) 100%);
      box-shadow: inset 0 0 120px rgba(255, 200, 80, 0.15);
    }
    #mission-complete-stars {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    #mission-complete-stars .star {
      width: 48px;
      height: 48px;
      background: radial-gradient(circle at 30% 30%, #fff8e0, #e6c84a 40%, #b8860b);
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      animation: starPulse 1.2s ease-in-out infinite;
      box-shadow: 0 0 16px rgba(232, 180, 50, 0.6);
    }
    #mission-complete-stars .star:nth-child(2) { animation-delay: 0.15s; }
    #mission-complete-stars .star:nth-child(3) { animation-delay: 0.3s; }
    #mission-complete-message {
      font-size: clamp(24px, 8vw, 48px);
      color: #fff8e0;
      text-align: center;
      margin-bottom: 24px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(255, 200, 80, 0.3);
    }
    #mission-complete-rewards {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      margin-bottom: 28px;
      max-width: 90%;
    }
    .reward-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(232, 180, 50, 0.6);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 120px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 24px rgba(232, 180, 50, 0.15);
    }
    .reward-card__label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .reward-card__icon {
      width: 64px;
      height: 64px;
      object-fit: contain;
      margin-bottom: 8px;
      border-radius: 8px;
    }
    .reward-card__name {
      font-size: 14px;
      font-weight: bold;
      color: #fff8e0;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }
    #mission-complete-button {
      background: linear-gradient(180deg, rgba(232, 180, 50, 0.4), rgba(184, 134, 11, 0.5));
      font-size: clamp(16px, 4vw, 22px);
      font-weight: bold;
      color: #fff8e0;
      border: 2px solid rgba(232, 180, 50, 0.8);
      border-radius: 8px;
      cursor: pointer;
      padding: 14px 28px;
      max-width: 90%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(232, 180, 50, 0.2);
    }
    #mission-complete-button:hover {
      background: linear-gradient(180deg, rgba(255, 220, 100, 0.5), rgba(212, 165, 30, 0.6));
      box-shadow: 0 0 24px rgba(232, 180, 50, 0.35);
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "mission-complete-overlay";
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
    opacity: "0",
  });

  const stars = document.createElement("div");
  stars.id = "mission-complete-stars";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("div");
    star.className = "star";
    stars.appendChild(star);
  }
  overlay.appendChild(stars);

  const message = document.createElement("h1");
  message.id = "mission-complete-message";
  message.textContent = i18n.t("rewardsTitle");
  overlay.appendChild(message);

  const rewardsContainer = document.createElement("div");
  rewardsContainer.id = "mission-complete-rewards";

  if (rewards.nextMap) {
    const card = document.createElement("div");
    card.className = "reward-card";
    const label = document.createElement("div");
    label.className = "reward-card__label";
    label.textContent = i18n.t("newMapUnlocked");
    const icon = document.createElement("img");
    icon.className = "reward-card__icon";
    icon.src = rewards.nextMap.imagem ?? "";
    icon.alt = rewards.nextMap.nome;
    const name = document.createElement("div");
    name.className = "reward-card__name";
    name.textContent = rewards.nextMap.nome;
    card.appendChild(label);
    card.appendChild(icon);
    card.appendChild(name);
    rewardsContainer.appendChild(card);
  }

  if (rewards.tower) {
    const card = document.createElement("div");
    card.className = "reward-card";
    const label = document.createElement("div");
    label.className = "reward-card__label";
    label.textContent = i18n.t("newTowerUnlocked");
    const icon = document.createElement("img");
    icon.className = "reward-card__icon";
    icon.src = getAssetUrl(TOWER_IMAGE_MAP[rewards.tower]);
    icon.alt = i18n.t(getFallbackTowerI18nKey(rewards.tower));
    const name = document.createElement("div");
    name.className = "reward-card__name";
    name.textContent = i18n.t(getFallbackTowerI18nKey(rewards.tower));
    card.appendChild(label);
    card.appendChild(icon);
    card.appendChild(name);
    rewardsContainer.appendChild(card);
  }

  overlay.appendChild(rewardsContainer);

  const startNextMap = () => {
    overlay.remove();
    style.remove();
    if (hasNextMap) {
      setSelectedMapIndex(nextMapIndex);
    }
    navigate("/play");
  };

  const button = document.createElement("button");
  button.id = "mission-complete-button";
  button.textContent = hasNextMap
    ? i18n.t("nextMapButton")
    : i18n.t("allMissionsComplete");
  button.onclick = startNextMap;
  overlay.appendChild(button);

  document.body.appendChild(overlay);
}
