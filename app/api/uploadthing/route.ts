import { createRouteHandler } from "uploadthing/next";

import { fileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: fileRouter,
  config: {
    isDev: process.env.NODE_ENV === "development",
  },

  // Apply an (optional) custom config:
  // config: { ... },
});
