import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable cache interception for better performance
  enableCacheInterception: true,
  // Set route preloading behavior to none to reduce CPU usage on cold starts
  routePreloadingBehavior: "none",
});
