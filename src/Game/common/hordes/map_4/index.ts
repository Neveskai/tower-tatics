import { MonsterConfig } from "@/Game/common/types/monsters.types";
import { wave_01_10 } from "./wave01_10";
import { wave_11_20 } from "./wave11_20";
import { wave_21_30 } from "./wave21_30";
import { wave_31_40 } from "./wave31_40";
import { wave_41_50 } from "./wave41_50";
import { wave_51_60 } from "./wave51_60";
import { wave_61_70 } from "./wave61_70";
import { wave_71_80 } from "./wave71_80";

export const Map4Waves: MonsterConfig[] = [
  ...wave_01_10,
  ...wave_11_20,
  ...wave_21_30,
  ...wave_31_40,
  ...wave_41_50,
  ...wave_51_60,
  ...wave_61_70,
  ...wave_71_80,
];
