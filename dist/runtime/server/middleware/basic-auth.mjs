import { useRuntimeConfig } from "#imports";
import { defineEventHandler } from "h3";
export default defineEventHandler((event) => {
  const config = useRuntimeConfig().basicAuth;
  if (!config.enabled || !config.users?.length || config.allowedRoutes?.some((route) => {
    const regex = new RegExp(route);
    return regex.test(event.node.req?.url || "");
  }) || config.allowedIps?.some((ip) => {
    const regex = new RegExp("" + ip.replace(".", "."));
    console.log("Req object:");
    console.log(event.node.req);
    const ipChain = event.node.req.socket.remoteAddress + " " + event.node.req.headers["x-forwarded-for"];
    console.log("Checking IP chain");
    console.log(ip);
    console.log(ipChain);
    return regex.test(ipChain);
  })) {
    return;
  }
  let authenticated = false;
  const credentials = event.node.req.headers?.authorization?.split(" ")[1];
  if (credentials) {
    const [username, password] = Buffer.from(credentials, "base64").toString("ascii").split(":");
    const users = Array.isArray(config.users) ? config.users : config.users.split(",").map((user) => {
      const [username2, password2] = user.split(":");
      return { username: username2, password: password2 };
    });
    authenticated = users.some(
      (user) => user.username === username && user.password === password
    );
  }
  if (!authenticated) {
    event.node.res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    event.node.res.statusCode = 401;
    event.node.res.end("Access denied");
  }
});
