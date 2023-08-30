import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";
import { defu } from "defu";

// Module options TypeScript interface definition
export interface ModuleOptions {
  enabled?: boolean;
  users?:
    | {
        username: string;
        password: string;
      }[]
    | string;
  allowedRoutes?: string[];
  allowedIps?: string[];
}

// Runtime config TypeScript interface definition
export type ModuleRuntimeConfig = ModuleOptions;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-basic-auth",
    configKey: "basicAuth",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    users: [{ username: "admin", password: "admin" }],
    allowedRoutes: [],
    allowedIps: [],
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    /**
     * Add runtime config to the Nuxt instance
     */
    nuxt.options.runtimeConfig.basicAuth = defu(
      nuxt.options.runtimeConfig.basicAuth || {},
      options
    );

    /**
     * Add the server middleware to the Nuxt instance
     */
    if (options.enabled) {
      addServerHandler({
        middleware: true,
        handler: resolve("./runtime/server/middleware/basic-auth"),
      });
    }
  },
});
