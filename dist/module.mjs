import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit';
import { defu } from 'defu';

const module = defineNuxtModule({
  meta: {
    name: "nuxt-basic-auth",
    configKey: "basicAuth"
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    users: [{ username: "admin", password: "admin" }],
    allowedRoutes: [],
    allowedIps: []
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.basicAuth = defu(
      nuxt.options.runtimeConfig.basicAuth || {},
      options
    );
    if (options.enabled) {
      addServerHandler({
        middleware: true,
        handler: resolve("./runtime/server/middleware/basic-auth")
      });
    }
  }
});

export { module as default };
