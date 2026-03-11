import { Container, Text, TextOptions } from 'pixi.js'

export const showFloatingText = (
  options: TextOptions,
  duration: number,
  container: Container
) => {
  const text = new Text(options)

  text.anchor.set(0.5)
  text.x = container.width / 4
  text.y = -10
  text.zIndex = 10000

  container.addChild(text)

  const startTime = performance.now()
  const startY = text.y
  const endY = text.y - 20

  const animate = (now: number) => {
    if (text?.destroyed) return

    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    text.y = startY + (endY - startY) * progress
    text.alpha = 1 - progress

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      container.removeChild(text)
      text.destroy()
    }
  }

  requestAnimationFrame(animate)
}
