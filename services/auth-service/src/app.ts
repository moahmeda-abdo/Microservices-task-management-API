import "express-async-errors";
import express from "express";
import morgan from "morgan";
import { NotFoundError } from "./core/errors";
import { HandleErrors } from "./core/middleware/errors/handle-errors.middleware";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { BindRequestNamespace } from "./core/middleware/bind_request_namespace.middleware";
import { API_Router } from "./api";
const app = express();


const whiteListOrigins: string[] = [];
const corsOptions: Record<string, any> = {
  origin: (origin: string, callback: (err: any, success?: boolean) => void) => {
    if (
      !origin ||
      origin.startsWith("http://localhost:") ||
      whiteListOrigins.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(new Error("Origin Not Allowed"));
    }
  },
};

app.use(cors(corsOptions));
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

app.use(
  "/static",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../static"))
);

app.use(BindRequestNamespace);

app.use("/health", (_, res) => {
  res.status(200).json({
    "success": true,
    "service": process.env.SERVICE_NAME,
    "status": "ok",
  });
});
// app.use( (req , res , next) =>{
// 	console.log({
// 		msg : "this message from v1 router",
// 		base : req.baseUrl,
// 		path : req.path,
// 		type : req.method
// 	})
// 	next()
// } )

app.use("/", API_Router);

app.use((_, __, ___) => {
  throw new NotFoundError("Route Not Found");
});
app.use(HandleErrors);

export { app };
