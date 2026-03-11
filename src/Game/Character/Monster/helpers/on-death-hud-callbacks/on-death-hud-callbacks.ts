import { MonsterCharacter } from "@/Game/Character";
import { useGameStore } from "@/Game/common/stores/state";
import { SCREEN } from "@/Game/common";

export function onDeathHudCallbacks(monster: MonsterCharacter) {
  const { setSelectedMonster, gameController, selectedMonster } =
    useGameStore.getState();

  if (selectedMonster?.id === monster.id) {
    const characterLayer = gameController
      ? gameController["charactersLayer"]
      : null;

    if (characterLayer) {
      const RADIUS = SCREEN.TILE_SIZE * 3;

      const nearby = characterLayer.getEnemiesInRange(
        monster.x,
        monster.y,
        RADIUS,
        true,
        true
      );

      const livingNearby = nearby.filter(
        (m) => m.id !== monster.id && m.isAlive
      );

      if (livingNearby.length > 0) {
        livingNearby.sort((a, b) => {
          const dxA = a.x - monster.x;
          const dyA = a.y - monster.y;
          const dxB = b.x - monster.x;
          const dyB = b.y - monster.y;
          return dxA * dxA + dyA * dyA - (dxB * dxB + dyB * dyB);
        });

        setSelectedMonster(livingNearby[0]);
      } else {
        setSelectedMonster(null);
      }
    } else {
      setSelectedMonster(null);
    }
  }
}
