import type ThreeUse from '@/index'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { useRenderClock } from '@/expands/useRenderClock'

export interface StatsOptions {
  show?: boolean,
  followContainer?: boolean
}

export const stats = {
  install: (
    app: ThreeUse,
    options: StatsOptions = {}
  ) => {
    const {
      show = true,
      followContainer = true,
    } = options

    if (!show) return

    const stats = new Stats()
    const statsDom = stats.dom

    const { start } = useRenderClock(() => {
      stats.update()
    }, { activate: false })

    if (followContainer) {
      statsDom.style.setProperty('position', 'absolute')
      statsDom.style.setProperty('z-index', '9999')

      app.subscribe({
        mount: () => {
          mount(app.getContainer())
        },
        unmount: () => {
          statsDom.remove()
          start.value = false
        }
      })
    } else {
      mount(document.body)
    }

    function mount(el: Element) {
      app.globalProperties.$stats
        && app.globalProperties.$stats.dom.remove()

      el.appendChild(statsDom)
      app.globalProperties.$stats = stats
      start.value = true
    }
  }
}
