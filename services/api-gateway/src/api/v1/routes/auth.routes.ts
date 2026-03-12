import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "../../../config/env";

const router = Router();


router.use(
    "/auth",
    createProxyMiddleware({
        target: ENV.authServiceUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/api/v1/auth/",
        },
        proxyTimeout: 10000,
        timeout: 10000,
    })
);

export { router as authRoutes }