import { PlacementConfig } from "@/Game/Placement";
import { User } from "firebase/auth";

export type MapWithUnlock = PlacementConfig & { unlocked: boolean };

export interface UserState {
  user: User | null;
  setUser: (value: User | null) => void;

  authModal: boolean;
  setAuthModal: (value: boolean) => void;

  configModal: boolean;
  setConfigModal: (value: boolean) => void;

  selectedMapIndex: number;
  setSelectedMapIndex: (value: number) => void;

  maps: MapWithUnlock[];
  getMaps: () => void;
  unlockMap: (mapId: number) => void;
}
