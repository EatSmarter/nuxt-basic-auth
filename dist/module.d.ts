import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    enabled?: boolean;
    users?: {
        username: string;
        password: string;
    }[] | string;
    allowedRoutes?: string[];
    allowedIps?: string[];
}
type ModuleRuntimeConfig = ModuleOptions;
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { ModuleOptions, ModuleRuntimeConfig, _default as default };
