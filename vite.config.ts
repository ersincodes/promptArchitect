import path from "path";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";

const apiPlugin = (): Plugin => {
  return {
    name: "api-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const routeName = req.url.replace("/api/", "").split("?")[0];
        const handlerPath = path.resolve(__dirname, `api/${routeName}.ts`);

        try {
          // Clear module cache to support hot reloading
          const modulePath = `file://${handlerPath.replace(/\\/g, "/")}`;
          
          // Collect request body
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          await new Promise<void>((resolve) => req.on("end", resolve));

          // Dynamically import the handler
          const module = await server.ssrLoadModule(handlerPath);
          const handler = module.default;

          if (typeof handler !== "function") {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Handler not found" }));
            return;
          }

          // Create mock req/res objects similar to Vercel's API
          const mockReq = {
            method: req.method,
            body: body ? JSON.parse(body) : undefined,
            query: Object.fromEntries(new URL(req.url, "http://localhost").searchParams),
            headers: req.headers,
          };

          const mockRes = {
            statusCode: 200,
            _headers: {} as Record<string, string>,
            status(code: number) {
              this.statusCode = code;
              return this;
            },
            json(data: unknown) {
              res.statusCode = this.statusCode;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            },
            setHeader(key: string, value: string) {
              this._headers[key] = value;
              res.setHeader(key, value);
            },
          };

          await handler(mockReq, mockRes);
        } catch (error: any) {
          console.error(`API Error [${routeName}]:`, error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: error?.message || "Internal server error" }));
        }
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react(), apiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": env,
    },
  };
});
