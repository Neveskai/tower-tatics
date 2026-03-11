import { Application, Renderer } from 'pixi.js'
import { Root } from 'react-dom/client'

type renderStateType = {
  resizeTimeout: NodeJS.Timeout | undefined
  resizeListener: (() => void) | undefined
  UI_root: Root | undefined
  app: Application<Renderer> | null
  container: HTMLElement
  shouldLoadAssets: boolean
  clearGame: () => void
  clearHUD: () => void
}

export const RenderState: renderStateType = {
  resizeTimeout: undefined,
  resizeListener: undefined,
  UI_root: undefined,
  app: null,
  shouldLoadAssets: true,
  container: document.getElementById('pixi-container')!,
  clearHUD: () => {
    if (RenderState.UI_root) RenderState.UI_root.unmount()
  },
  clearGame: () => {
    if (RenderState.resizeListener) {
      window.removeEventListener('resize', RenderState.resizeListener)
      RenderState.resizeListener = undefined
    }

    if (RenderState.app) {
      try {
        if (RenderState.app.stage) RenderState.app.stage.removeChildren()
        RenderState.app.ticker?.stop()
        RenderState.app.destroy(true, {
          children: true,
          texture: false
        })
      } finally {
        RenderState.app = null
      }
      if (RenderState.container) RenderState.container.style.display = 'none'
    }

    if (RenderState.container) RenderState.container.innerHTML = ''
  }
}
