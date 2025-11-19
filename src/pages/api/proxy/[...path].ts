import type { NextApiRequest, NextApiResponse } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

const TARGET_API_BASE_URL =
  process.env.BACKEND_API_URL ?? "https://wundu-api-production.up.railway.app/api/v1";

const proxy = createProxyMiddleware({
  target: TARGET_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/proxy": "",
  },
  proxyTimeout: 120000,
  timeout: 120000,
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        console.error("Proxy error:", result.message);
        reject(result);
        return;
      }
      resolve();
    });
  });
}
