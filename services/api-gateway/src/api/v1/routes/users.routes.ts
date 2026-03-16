import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "../../../config/env";

const router = Router();


router.use("/users", createProxyMiddleware({
    target: ENV.usersServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => `/api/v1/users${path}`,
    proxyTimeout: 10000,
    timeout: 10000,
}))

export { router as usersRoutes }