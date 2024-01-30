import type {
  CreateAppOptions,
  CreateAppReturnValue,
  GlobalPropertiesType
} from './index.d'
import { ThreeUse } from './ThreeUse'

export function createApp(options: CreateAppOptions = {}): CreateAppReturnValue {
  const app = new ThreeUse(options)

  const proxyApp: CreateAppReturnValue = new Proxy(app, {
    get(target, property) {
      return (target as GlobalPropertiesType)[property] ?? app.globalProperties[property]
    }
  })

  return proxyApp
}
