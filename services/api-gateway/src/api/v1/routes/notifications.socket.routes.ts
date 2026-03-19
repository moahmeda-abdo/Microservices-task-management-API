import { Router } from "express";
import { IncomingMessage } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "../../../config/env";

type ProxyRequest = IncomingMessage & {
    originalUrl?: string;
};

function rewriteNotificationsSocketPath(path: string, req: ProxyRequest) {
    const requestPath = req.originalUrl || req.url || path;

    return requestPath.replace(
        /^\/api\/v1\/notifications\/socket\.io/,
        "/socket.io"
    );
}

const notificationsSocketProxy = createProxyMiddleware({
    target: ENV.notificationsServiceUrl,
    changeOrigin: true,
    ws: true,
    pathRewrite: rewriteNotificationsSocketPath,
    proxyTimeout: 10000,
    timeout: 10000,
    on: {
        proxyReqWs: (_, req) => {
            console.log(
                `[api-gateway] proxying notifications socket upgrade ${req.url}`
            );
        },
        error: (error, req) => {
            console.error(
                `[api-gateway] notifications socket proxy error ${req.url}`,
                error
            );
        },
    },
});

const router = Router();

router.use("/notifications/socket.io", notificationsSocketProxy);

export { notificationsSocketProxy, router as notificationsSocketRoutes };
