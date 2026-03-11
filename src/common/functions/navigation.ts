export type NavigateOptions = { replace?: boolean; state?: unknown };

type NavigateFn = (to: string | number, options?: NavigateOptions) => void;
let navigateFn: NavigateFn | null = null;

export function setNavigate(fn: NavigateFn | null) {
  navigateFn = fn;
}

export function navigate(to: string | number, options?: NavigateOptions) {
  if (navigateFn) navigateFn(to, options);
}
