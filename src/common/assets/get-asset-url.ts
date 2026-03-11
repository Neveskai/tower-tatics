/**
 * Retorna a URL do asset relativa à aplicação.
 * Os assets ficam em public/assets/ e são servidos junto do build (nunca do bucket).
 */
export const getAssetUrl = (localPath: string): string => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/?$/, "/");
  const path = localPath.replace(/^\//, "");
  return `${base}${path}`;
};
