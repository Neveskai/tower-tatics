import { MonsterConfig } from "@/Game/common/types/monsters.types";
import { wave_01_10 } from "./wave01_10";
import { wave_11_20 } from "./wave11_20";
import { wave_21_30 } from "./wave21_30";
import { wave_31_40 } from "./wave31_40";

export const Map2Waves: MonsterConfig[] = [
  ...wave_01_10,
  ...wave_11_20,
  ...wave_21_30,
  ...wave_31_40,
];
