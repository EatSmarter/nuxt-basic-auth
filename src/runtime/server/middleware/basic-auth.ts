import { useRuntimeConfig } from "#imports";
import { defineEventHandler } from "h3";
import type { ModuleRuntimeConfig } from "../../../module";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig().basicAuth as ModuleRuntimeConfig;

  /**
   * If the module is not enabled, or no users are defined, or the current route is allowed, or the source IP is whitelisted, do nothing.
   */
  if (
    !config.enabled ||
    !config.users?.length ||
    config.allowedRoutes?.some((route) => {
      const regex = new RegExp(route);

      return regex.test(event.node.req?.url || "");
    }) ||
    config.allowedIps?.some((ip) => {
      const regex = new RegExp(' ' + ip.replace('.', '\.'));
      const ipChain = ' ' + event.node.req.socket.remoteAddress + ' ' +  event.node.req.headers['x-forwarded-for'];
      
      return regex.test(ipChain);
    })
  ) {
    return;
  }

  let authenticated = false;

  /**
   * Get the credentials from the Authorization header.
   */
  const credentials = event.node.req.headers?.authorization?.split(" ")[1];

  /**
   * If the credentials are defined, check if they match any of the users.
   */
  if (credentials) {
    const [username, password] = Buffer.from(credentials, "base64")
      .toString("ascii")
      .split(":");

    const users = Array.isArray(config.users)
      ? config.users
      : config.users.split(",").map((user) => {
          const [username, password] = user.split(":");
          return { username, password };
        });

    authenticated = users.some(
      (user) => user.username === username && user.password === password
    );
  }

  /**
   * If the user is not authenticated or the credentials are not defined, send a 401 response.
   */
  if (!authenticated) {
    event.node.res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    event.node.res.statusCode = 401;
    event.node.res.end("Access denied");
  }
});
