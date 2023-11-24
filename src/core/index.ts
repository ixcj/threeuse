import { CreateAppOptions } from './index.d'
import { ThreeUse } from '../ThreeUse'

export const createApp = (options: CreateAppOptions = {}) => new ThreeUse(options)
