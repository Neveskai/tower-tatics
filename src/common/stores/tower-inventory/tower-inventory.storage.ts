import { Storage } from "@capacitor/storage";
import { TowerTypes } from "@/common/enum/tower-types";
import type { TowerInventory } from "./tower-inventory.types";
import { TOWER_INVENTORY_KEY, MAX_EQUIPPED } from "./tower-inventory.constants";

export function clampEquipped(equipped: TowerTypes[]): TowerTypes[] {
  return equipped.slice(0, MAX_EQUIPPED);
}

export async function saveTowerInventory(inventory: TowerInventory): Promise<void> {
  const clamped = {
    ...inventory,
    equipped: clampEquipped(inventory.equipped),
  };
  await Storage.set({
    key: TOWER_INVENTORY_KEY,
    value: JSON.stringify(clamped),
  });
}

export async function loadTowerInventory(): Promise<TowerInventory | null> {
  const { value } = await Storage.get({ key: TOWER_INVENTORY_KEY });
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as TowerInventory;
    return {
      ...parsed,
      equipped: clampEquipped(parsed.equipped ?? []),
    };
  } catch {
    return null;
  }
}
