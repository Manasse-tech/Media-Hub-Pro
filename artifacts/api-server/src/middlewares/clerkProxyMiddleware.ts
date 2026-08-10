/**
 * Clerk Frontend API proxy for production custom domains.
 */
import type { IncomingHttpHeaders } from "http";
import type { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const CLERK_FAPI = "https://frontend-api.clerk.dev";
export const CLERK_PROXY_PATH = "/api/__clerk";

export function getClerkProxyHost(req: { headers: IncomingHttpHeaders }): string | undefined {
  const forwarded = req.headers["x-forwarded-host"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || req.headers.host?.trim() || undefined;
}

export function clerkProxyMiddleware(): RequestHandler {
  if (process.env.NODE_ENV !== "production" || !process.env.CLERK_SECRET_KEY) {
    return (_req, _res, next) => next();
  }

  return createProxyMiddleware({
    target: CLERK_FAPI,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: (path: string) => path.replace(new RegExp(`^${CLERK_PROXY_PATH}`), ""),
    on: {
      proxyReq: (proxyReq, req) => {
        const protocol = req.headers["x-forwarded-proto"] || "https";
        const host = getClerkProxyHost(req) || "";
        proxyReq.setHeader("Clerk-Proxy-Url", `${protocol}://${host}${CLERK_PROXY_PATH}`);
        proxyReq.setHeader("Clerk-Secret-Key", process.env.CLERK_SECRET_KEY ?? "");
      },
      proxyRes: (proxyRes, req, res) => {
        const headers = { ...proxyRes.headers };
        delete headers["transfer-encoding"];
        delete headers["connection"];
        if (headers["content-length"] !== undefined || req.method === "HEAD" || proxyRes.statusCode === 204) {
          res.writeHead(proxyRes.statusCode ?? 502, headers);
          proxyRes.pipe(res);
          return;
        }
        const chunks: Buffer[] = [];
        proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
        proxyRes.on("end", () => {
          const body = Buffer.concat(chunks);
          headers["content-length"] = String(body.length);
          res.writeHead(proxyRes.statusCode ?? 502, headers);
          res.end(body);
        });
        proxyRes.on("error", () => res.destroy());
      },
    },
  }) as RequestHandler;
}