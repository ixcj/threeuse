import type ThreeUse from '@/index'
import Stats from 'three/examples/jsm/libs/stats.module.js'
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

    const statsDom = app.globalProperties.$stats.dom

    if (followContainer) {
      app.subscribe({
        mount: () => {
          statsDom.style.setProperty('position', 'absolute')
          app.getContainer().appendChild(statsDom)
        },
        unmount: () => {
          statsDom.remove()
        }
      })
    } else {
      document.body.appendChild(statsDom)
    }

    useRenderClock(() => {
      stats.update()
    })
  }
} 
