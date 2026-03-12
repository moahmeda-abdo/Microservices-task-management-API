import { Middleware } from '../../api/common/types.common';
import { createNamespace } from "continuation-local-storage";

const default_namespace = createNamespace("default");

export const BindRequestNamespace:  Middleware = (req, res, next) => {
  default_namespace.bindEmitter(req);
	default_namespace.bindEmitter(res);
	default_namespace.run(() => {
		default_namespace.set("lang", req.headers["content-language"]);
		default_namespace.set("apiKey", req.headers["x-api-key"]);
		next!();
	});
}