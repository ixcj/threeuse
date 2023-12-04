import type ThreeUse from '@/index'
import Stats from 'stats.js'
import { useRenderClock } from '@/hooks/other/useRenderClock'

export const stats = {
  install: (app: ThreeUse, ...options: any[]) => {
    const [
      show = true,
      followContainer = true
    ] = options

    if (!show) return

    const stats = new Stats()
    app.globalProperties.$stats = stats
    app.globalProperties.$stats.showPanel(0)

    const container = app.getContainer()
    const statsDom = app.globalProperties.$stats.dom

    if (container && followContainer) {
      statsDom.style.setProperty('position', 'absolute')
      container.appendChild(statsDom)
    } else {
      document.body.appendChild(statsDom)
    }

    useRenderClock(() => {
      stats.update()
    })
  }
} 
