/**
 * Seeds Firestore collection catalog_towers from tower config data.
 * Run: yarn seed:catalog
 * Requires: GOOGLE_APPLICATION_CREDENTIALS or Firebase project in .env / default credentials.
 *
 * Data is kept in sync with src/Game/common/constants/towers.constants.ts (TowerConfigs).
 * Update this payload when TowerConfigs change.
 */
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const COLLECTION = "catalog_towers";

const SELL_TAX = 0.5;
const BASE_BULLET_MS = 200;
const MACHINE_GUN_COST = 5;
const HEAVY_GUN_COST = 15;
const MISSILE_COST = 20;
const ELETRIC_COST = 30;
const ANTI_AIR_COST = 50;
const FREEZE_COST = 50;

type SeedDoc = {
  id: string;
  order: number;
  i18nKeyName: string;
  assets: { bulletAsset: string; bulletSize: { width: number; height: number }; bulletSpeed: number };
  combat: {
    range: number;
    attackSpeed: number;
    attackDamage: number;
    AoE: number;
    attackAir: boolean;
    attackTerrain: boolean;
    special?: Record<string, unknown>;
  };
  economy: { cost: number; sellPrices: Record<number, number> };
  upgrades: Record<
    number,
    { range?: number; attackSpeed?: number; attackDamage?: number; AoE?: number; cost: number; special?: Record<string, unknown> }
  >;
  enabled: boolean;
  element: string;
};

function buildSeedDocs(): SeedDoc[] {
  return [
    {
      id: "machine-gun",
      order: 0,
      i18nKeyName: "turretMachineGun",
      assets: { bulletAsset: "bullet-mg", bulletSize: { width: 5, height: 20 }, bulletSpeed: BASE_BULLET_MS },
      combat: { range: 4, attackSpeed: 0.75, attackDamage: 20, AoE: 0, attackAir: true, attackTerrain: true },
      economy: {
        cost: MACHINE_GUN_COST,
        sellPrices: {
          1: Math.floor(MACHINE_GUN_COST * SELL_TAX),
          2: Math.floor(MACHINE_GUN_COST * 2 * SELL_TAX),
          3: Math.floor(MACHINE_GUN_COST * 5 * SELL_TAX),
          4: Math.floor(MACHINE_GUN_COST * 13 * SELL_TAX),
          5: Math.floor(MACHINE_GUN_COST * 25 * SELL_TAX),
          6: Math.floor(MACHINE_GUN_COST * 43 * SELL_TAX),
        },
      },
      upgrades: {
        2: { range: 4, attackSpeed: 0.75, attackDamage: 40, AoE: 0, cost: MACHINE_GUN_COST },
        3: { range: 4, attackSpeed: 0.75, attackDamage: 100, AoE: 0, cost: MACHINE_GUN_COST * 3 },
        4: { range: 4, attackSpeed: 0.75, attackDamage: 260, AoE: 0, cost: MACHINE_GUN_COST * 8 },
        5: { range: 4, attackSpeed: 0.75, attackDamage: 500, AoE: 0, cost: MACHINE_GUN_COST * 12 },
        6: { range: 8, attackSpeed: 0.6, attackDamage: 1000, AoE: 0, cost: MACHINE_GUN_COST * 18 },
      },
      enabled: true,
      element: "neutral",
    },
    {
      id: "missile",
      order: 1,
      i18nKeyName: "turretCannon",
      assets: { bulletAsset: "bullet-missile", bulletSize: { width: 20, height: 20 }, bulletSpeed: BASE_BULLET_MS },
      combat: { range: 6, attackSpeed: 0.3, attackDamage: 40, AoE: 3, attackAir: false, attackTerrain: true },
      economy: {
        cost: MISSILE_COST,
        sellPrices: {
          1: Math.floor(MISSILE_COST * SELL_TAX),
          2: Math.floor(MISSILE_COST * 2 * SELL_TAX),
          3: Math.floor(MISSILE_COST * 5 * SELL_TAX),
          4: Math.floor(MISSILE_COST * 10 * SELL_TAX),
          5: Math.floor(MISSILE_COST * 22 * SELL_TAX),
          6: Math.floor(MISSILE_COST * 40 * SELL_TAX),
        },
      },
      upgrades: {
        2: { range: 6, attackSpeed: 0.3, attackDamage: 80, AoE: 3, cost: MISSILE_COST },
        3: { range: 6, attackSpeed: 0.3, attackDamage: 200, AoE: 3, cost: MISSILE_COST * 3 },
        4: { range: 6, attackSpeed: 0.35, attackDamage: 440, AoE: 3, cost: MISSILE_COST * 6 },
        5: { range: 6, attackSpeed: 0.35, attackDamage: 1000, AoE: 3, cost: MISSILE_COST * 12 },
        6: { range: 7, attackSpeed: 0.4, attackDamage: 1720, AoE: 3, cost: MISSILE_COST * 18 },
      },
      enabled: true,
      element: "fire",
    },
    {
      id: "heavy-gun",
      order: 2,
      i18nKeyName: "turretHeavyGun",
      assets: { bulletAsset: "bullet-mg", bulletSize: { width: 10, height: 16 }, bulletSpeed: BASE_BULLET_MS * 4 },
      combat: { range: 5, attackSpeed: 5, attackDamage: 10, AoE: 0, attackAir: true, attackTerrain: true },
      economy: {
        cost: HEAVY_GUN_COST,
        sellPrices: {
          1: Math.floor(HEAVY_GUN_COST * SELL_TAX),
          2: Math.floor(HEAVY_GUN_COST * 2 * SELL_TAX),
          3: Math.floor(HEAVY_GUN_COST * 5 * SELL_TAX),
          4: Math.floor(HEAVY_GUN_COST * 13 * SELL_TAX),
          5: Math.floor(HEAVY_GUN_COST * 29 * SELL_TAX),
          6: Math.floor(HEAVY_GUN_COST * 51 * SELL_TAX),
        },
      },
      upgrades: {
        2: { range: 5, attackSpeed: 5, attackDamage: 20, AoE: 0, cost: HEAVY_GUN_COST },
        3: { range: 5, attackSpeed: 5, attackDamage: 50, AoE: 0, cost: HEAVY_GUN_COST * 3 },
        4: { range: 5, attackSpeed: 5, attackDamage: 130, AoE: 0, cost: HEAVY_GUN_COST * 8 },
        5: { range: 5, attackSpeed: 5.5, attackDamage: 340, AoE: 0, cost: HEAVY_GUN_COST * 16 },
        6: { range: 6, attackSpeed: 5.5, attackDamage: 720, AoE: 0, cost: HEAVY_GUN_COST * 24 },
      },
      enabled: true,
      element: "neutral",
    },
    {
      id: "electric",
      order: 3,
      i18nKeyName: "turretElectric",
      assets: { bulletAsset: "bullet-mg", bulletSize: { width: 1, height: 1 }, bulletSpeed: BASE_BULLET_MS },
      combat: {
        range: 2.5,
        attackSpeed: 0.5,
        attackDamage: 40,
        AoE: 2.5,
        attackAir: false,
        attackTerrain: true,
        special: { stunDuration: 0.65, stunChance: 0.1 },
      },
      economy: {
        cost: ELETRIC_COST,
        sellPrices: {
          1: Math.floor(ELETRIC_COST * SELL_TAX),
          2: Math.floor(ELETRIC_COST * 2 * SELL_TAX),
          3: Math.floor(ELETRIC_COST * 5 * SELL_TAX),
          4: Math.floor(ELETRIC_COST * 10 * SELL_TAX),
          5: Math.floor(ELETRIC_COST * 17 * SELL_TAX),
          6: Math.floor(ELETRIC_COST * 26 * SELL_TAX),
        },
      },
      upgrades: {
        2: {
          range: 2.5,
          attackSpeed: 0.5,
          attackDamage: 80,
          AoE: 2.5,
          cost: ELETRIC_COST,
          special: { stunDuration: 0.65, stunChance: 0.12 },
        },
        3: {
          range: 2.5,
          attackSpeed: 0.5,
          attackDamage: 200,
          AoE: 2.5,
          cost: ELETRIC_COST * 3,
          special: { stunDuration: 0.65, stunChance: 0.14 },
        },
        4: {
          range: 2.5,
          attackSpeed: 0.5,
          attackDamage: 400,
          AoE: 2.5,
          cost: ELETRIC_COST * 5,
          special: { stunDuration: 0.65, stunChance: 0.16 },
        },
        5: {
          range: 2.5,
          attackSpeed: 0.5,
          attackDamage: 680,
          AoE: 2.5,
          cost: ELETRIC_COST * 7,
          special: { stunDuration: 0.7, stunChance: 0.18 },
        },
        6: {
          range: 2.5,
          attackSpeed: 0.5,
          attackDamage: 1080,
          AoE: 2.5,
          cost: ELETRIC_COST * 10,
          special: { stunDuration: 0.75, stunChance: 0.2 },
        },
      },
      enabled: true,
      element: "lightning",
    },
    {
      id: "freeze",
      order: 4,
      i18nKeyName: "turretFreeze",
      assets: { bulletAsset: "bullet-mg", bulletSize: { width: 15, height: 20 }, bulletSpeed: BASE_BULLET_MS },
      combat: {
        range: 4,
        attackSpeed: 2,
        attackDamage: 5,
        AoE: 0,
        attackAir: true,
        attackTerrain: true,
        special: { slowDuration: 3.5, slowFactor: 0.75 },
      },
      economy: {
        cost: FREEZE_COST,
        sellPrices: {
          1: Math.floor(FREEZE_COST * SELL_TAX),
          2: Math.floor(FREEZE_COST * 1.5 * SELL_TAX),
          3: Math.floor(FREEZE_COST * 2 * SELL_TAX),
          4: Math.floor(FREEZE_COST * 2.5 * SELL_TAX),
          5: Math.floor(FREEZE_COST * 3 * SELL_TAX),
          6: Math.floor(FREEZE_COST * 4 * SELL_TAX),
        },
      },
      upgrades: {
        2: {
          range: 4,
          attackSpeed: 2,
          attackDamage: 10,
          AoE: 0,
          cost: FREEZE_COST * 0.5,
          special: { slowDuration: 3.5, slowFactor: 0.8 },
        },
        3: {
          range: 4,
          attackSpeed: 2,
          attackDamage: 15,
          AoE: 0,
          cost: FREEZE_COST * 0.5,
          special: { slowDuration: 3.5, slowFactor: 0.75 },
        },
        4: {
          range: 4,
          attackSpeed: 2,
          attackDamage: 20,
          AoE: 0,
          cost: FREEZE_COST * 0.5,
          special: { slowDuration: 3.5, slowFactor: 0.7 },
        },
        5: {
          range: 4,
          attackSpeed: 2,
          attackDamage: 25,
          AoE: 0,
          cost: FREEZE_COST * 0.5,
          special: { slowDuration: 4, slowFactor: 0.65 },
        },
        6: {
          range: 5,
          attackSpeed: 2,
          attackDamage: 50,
          AoE: 0,
          cost: FREEZE_COST,
          special: { slowDuration: 4, slowFactor: 0.65 },
        },
      },
      enabled: true,
      element: "ice",
    },
    {
      id: "anti-air",
      order: 5,
      i18nKeyName: "turretAntiAir",
      assets: {
        bulletAsset: "bullet-anti-air",
        bulletSize: { width: 7, height: 15 },
        bulletSpeed: BASE_BULLET_MS * 0.75,
      },
      combat: {
        range: 4,
        attackSpeed: 1.25,
        attackDamage: 80,
        AoE: 2,
        attackAir: true,
        attackTerrain: false,
      },
      economy: {
        cost: ANTI_AIR_COST,
        sellPrices: {
          1: Math.floor(ANTI_AIR_COST * SELL_TAX),
          2: Math.floor(ANTI_AIR_COST * 2 * SELL_TAX),
          3: Math.floor(ANTI_AIR_COST * 4 * SELL_TAX),
          4: Math.floor(ANTI_AIR_COST * 7 * SELL_TAX),
          5: Math.floor(ANTI_AIR_COST * 12 * SELL_TAX),
          6: Math.floor(ANTI_AIR_COST * 19 * SELL_TAX),
        },
      },
      upgrades: {
        2: { range: 4, attackSpeed: 1.25, attackDamage: 160, AoE: 2, cost: ANTI_AIR_COST },
        3: { range: 4, attackSpeed: 1.25, attackDamage: 340, AoE: 2, cost: ANTI_AIR_COST * 2 },
        4: { range: 4, attackSpeed: 1.25, attackDamage: 620, AoE: 2, cost: ANTI_AIR_COST * 3 },
        5: { range: 4, attackSpeed: 1.5, attackDamage: 1080, AoE: 2, cost: ANTI_AIR_COST * 5 },
        6: { range: 5, attackSpeed: 1.75, attackDamage: 1720, AoE: 2, cost: ANTI_AIR_COST * 7 },
      },
      enabled: true,
      element: "neutral",
    },
  ];
}

async function main() {
  let projectId =
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.GCLOUD_PROJECT ??
    process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    try {
      const { execSync } = await import("child_process");
      projectId = execSync("gcloud config get-value project", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      })
        .trim()
        .split("\n")
        .pop()
        ?.trim();
      if (projectId === "(unset)" || !projectId) projectId = undefined;
    } catch {
      // gcloud not available or not configured
    }
  }

  if (!getApps().length) {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (keyPath) {
      const { readFileSync } = await import("fs");
      const key = JSON.parse(readFileSync(keyPath, "utf8")) as { project_id?: string };
      projectId = projectId ?? key.project_id;
      initializeApp({ credential: cert(key), projectId });
    } else {
      try {
        initializeApp(projectId ? { credential: applicationDefault(), projectId } : { credential: applicationDefault() });
      } catch {
        if (projectId) initializeApp({ projectId });
      }
    }
  }

  if (!projectId) {
    console.error(
      "Project ID not set. Use one of:\n" +
        "  - FIREBASE_PROJECT_ID=your-project yarn seed:catalog\n" +
        "  - gcloud config set project YOUR_PROJECT_ID  (then run yarn seed:catalog again)\n" +
        "  - GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json with a key file that has project_id"
    );
    process.exit(1);
  }

  const db = getFirestore();
  const docs = buildSeedDocs();

  console.log(`Using project: ${projectId}`);
  console.log(`Writing ${docs.length} documents to ${COLLECTION}...`);

  for (const doc of docs) {
    await db.collection(COLLECTION).doc(doc.id).set(doc, { merge: true });
    console.log(`Written: ${COLLECTION}/${doc.id}`);
  }

  console.log(`Done. ${docs.length} documents written to ${COLLECTION}.`);
}

const NOT_FOUND_CODE = 5;

main().catch((err: unknown) => {
  const code = err && typeof err === "object" && "code" in err ? (err as { code?: number }).code : undefined;
  if (code === NOT_FOUND_CODE) {
    console.error(
      "Firestore NOT_FOUND: the database does not exist or is not accessible for this project.\n\n" +
        "1. Open https://console.firebase.google.com/ and select the same project (or create one).\n" +
        "2. Go to Build > Firestore Database and click \"Create database\".\n" +
        "3. Choose a location and start in production or test mode.\n" +
        "4. Run yarn seed:catalog again.\n\n" +
        "Ensure the project ID matches the app (e.g. VITE_FIREBASE_PROJECT_ID in .env)."
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
