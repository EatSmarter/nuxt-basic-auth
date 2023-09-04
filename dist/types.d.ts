
import { ModuleOptions, ModuleRuntimeConfig } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['basicAuth']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['basicAuth']?: ModuleOptions }
  interface RuntimeConfig extends ModuleRuntimeConfig {}
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['basicAuth']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['basicAuth']?: ModuleOptions }
  interface RuntimeConfig extends ModuleRuntimeConfig {}
}


export { ModuleOptions, ModuleRuntimeConfig, default } from './module'
