import { syncFromLocal } from "@/common/functions/firebase-sync";
import { Storage } from "@capacitor/storage";
import { User } from "firebase/auth";

const SHOULD_SYNC_LOCAL_KEY = "should_sync_from_local";

export const verifyAndSyncFromLocal = async (user: User) => {
  const { value: shouldSync } = await Storage.get({
    key: SHOULD_SYNC_LOCAL_KEY,
  });

  if (shouldSync === "v") {
    await Storage.set({ key: SHOULD_SYNC_LOCAL_KEY, value: "f" });
    await syncFromLocal(user.uid);
  }
};

export const setSyncFromLocal = async () => {
  await Storage.set({ key: SHOULD_SYNC_LOCAL_KEY, value: "v" });
};
