export {}
declare global {
  interface Window {
    fakeLoader: () => void
    showPreloader: () => void
    hidePreloader: () => Promise<boolean>
    updatePreloaderProgress: (percentage: number) => void
    fakeLoaderInterval: NodeJS.Timeout
  }
}
