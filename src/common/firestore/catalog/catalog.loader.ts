import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/common/providers/firebase'
import { TowerTypes } from '@/common/enum/tower-types'
import type {
  FirestoreTowerCatalogDoc,
  FirestoreMissionCatalogDoc,
  TowerConfig
} from './catalog.types'
/** Valid TowerTypes values (const enum has no runtime object). */
const TOWER_TYPE_VALUES = new Set<TowerTypes>([
  TowerTypes.MACHINE_GUN,
  TowerTypes.MISSILE,
  TowerTypes.HEAVY_GUN,
  TowerTypes.ELECTRIC,
  TowerTypes.FREEZE,
  TowerTypes.ANTI_AIR
])

/** Normalize tower id (e.g. "heavy_gun") to TowerTypes value ("heavy-gun"). Export for use in shop/inventory. */
export function normalizeTowerId(id: string): TowerTypes {
  const withHyphens = id.replace(/_/g, '-')
  if (TOWER_TYPE_VALUES.has(withHyphens as TowerTypes))
    return withHyphens as TowerTypes
  if (TOWER_TYPE_VALUES.has(id as TowerTypes)) return id as TowerTypes
  return id as TowerTypes
}

/** Returns the tower id only if it is in the allowlist; otherwise null (caller should skip invalid docs). */
function filterValidTowerId(id: string): TowerTypes | null {
  const normalized = id.replace(/_/g, '-')
  if (TOWER_TYPE_VALUES.has(normalized as TowerTypes)) return normalized as TowerTypes
  if (TOWER_TYPE_VALUES.has(id as TowerTypes)) return id as TowerTypes
  return null
}

export const FIRESTORE_COLLECTION_CATALOG_TOWERS = 'catalog_towers'
export const FIRESTORE_COLLECTION_CATALOG_MISSIONS = 'catalog_missions'

const LOAD_TIMEOUT_MS = 30_000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Catalog load timeout')), ms)
    )
  ])
}

function firestoreDocToTowerConfig(doc: FirestoreTowerCatalogDoc): TowerConfig {
  const { assets, combat, economy, upgrades } = doc
  const id = normalizeTowerId(doc.id)
  return {
    id,
    bulletSpeed: assets.bulletSpeed,
    bulletSize: assets.bulletSize,
    bulletAsset: assets.bulletAsset,
    range: combat.range,
    attackSpeed: combat.attackSpeed,
    attackDamage: combat.attackDamage,
    AoE: combat.AoE,
    cost: economy.cost,
    attackAir: combat.attackAir,
    attackTerrain: combat.attackTerrain,
    special: combat.special,
    sell_prices: economy.sellPrices ?? {},
    upgrades: upgrades ?? {}
  }
}

const CATALOG_EMPTY_MESSAGE =
  'Tower catalog empty. Run: yarn seed:catalog (with Firestore credentials) and ensure catalog_towers has documents.'

/**
 * Loads tower catalog from Firestore. Throws if collection is empty or load fails (no fallback).
 * Firestore rules must allow read on `catalog_towers` without auth (catalog loads before login).
 */
export async function loadTowerCatalog(): Promise<{
  configs: Record<TowerTypes, TowerConfig>
  order: TowerTypes[]
}> {
  try {
    const col = collection(db, FIRESTORE_COLLECTION_CATALOG_TOWERS)
    const snapshot = await withTimeout(getDocs(col), LOAD_TIMEOUT_MS)

    if (snapshot.empty) {
      throw new Error(CATALOG_EMPTY_MESSAGE)
    }

    const configs = {} as Record<TowerTypes, TowerConfig>
    const order: TowerTypes[] = []

    const docs = snapshot.docs
      .map(d => d.data() as FirestoreTowerCatalogDoc)
      .filter(d => d.enabled !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    for (const doc of docs) {
      const validId = filterValidTowerId(doc.id)
      if (validId === null) continue
      const config = firestoreDocToTowerConfig({ ...doc, id: validId })
      configs[config.id] = config
      order.push(config.id)
    }

    if (order.length === 0) {
      throw new Error(CATALOG_EMPTY_MESSAGE)
    }

    return { configs, order }
  } catch (err) {
    if (err instanceof Error && err.message === CATALOG_EMPTY_MESSAGE) throw err
    const cause = err instanceof Error ? err.message : String(err)
    const code =
      err && typeof err === 'object' && 'code' in err
        ? (err as { code: string }).code
        : ''
    throw new Error(
      `Failed to load tower catalog from Firestore.${code ? ` [${code}]` : ''} ${cause}`
    )
  }
}

/**
 * Loads mission catalog from Firestore. Falls back to empty array on error.
 */
export async function loadMissionCatalog(): Promise<
  FirestoreMissionCatalogDoc[]
> {
  try {
    const col = collection(db, FIRESTORE_COLLECTION_CATALOG_MISSIONS)
    const snapshot = await withTimeout(getDocs(col), LOAD_TIMEOUT_MS)

    if (snapshot.empty) return []

    return snapshot.docs
      .map(d => d.data() as FirestoreMissionCatalogDoc)
      .filter(d => d.enabled !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch {
    return []
  }
}
