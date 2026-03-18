import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from "@core/errors";
import { JWT } from "@core/services";

export const RequireAuth: Middleware = async (req, _res, next) => {
	const authorization = req.headers.authorization;

	if (!authorization) {
		throw new UnAuthorizedError("Authorization header is required");
	}

	if (!authorization.startsWith("Bearer ")) {
		throw new UnAuthorizedError("Invalid authorization format");
	}

	const token = authorization.split(" ")[1];

	if (!token) {
		throw new UnAuthorizedError("Token is required");
	}

	try {
		const payload = JWT.verify(token) as {
			auth_id: string;
			email: string;
			role: string;
		};

		req.currentUser = payload;
		next?.();
	} catch (_error) {
		throw new UnAuthorizedError("Invalid or expired token");
	}
};
