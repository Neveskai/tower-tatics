export function resolveDamage(baseAmount: number): number {
  return Math.max(0, Math.floor(baseAmount));
}
