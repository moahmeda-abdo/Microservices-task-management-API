import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "../../../config/env";

const router = Router();


router.use("/tasks", createProxyMiddleware({
    target: ENV.tasksServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => `/api/v1/tasks${path}`,
    proxyTimeout: 10000,
    timeout: 10000,
}))

export { router as tasksRoutes }