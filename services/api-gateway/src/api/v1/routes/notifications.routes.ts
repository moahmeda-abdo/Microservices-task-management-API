import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "../../../config/env";

const router = Router();

router.use(
    "/notifications",
    createProxyMiddleware({
        target: ENV.notificationsServiceUrl,
        changeOrigin: true,
        pathRewrite: (path) => `/api/v1/notifications${path}`,
        proxyTimeout: 10000,
        timeout: 10000,
        on: {
            proxyReq: (_, req) => {
                const request = req as { method?: string; url?: string };
                console.log(
                    `[api-gateway] proxying notifications http ${request.method} ${request.url}`
                );
            },
            error: (error, req) => {
                console.error(
                    `[api-gateway] notifications http proxy error ${req.method} ${req.url}`,
                    error
                );
            },
        },
    })
);

export { router as notificationsRoutes };
