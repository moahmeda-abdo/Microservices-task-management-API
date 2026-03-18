import { Router, Request } from "express";

import { Notification } from "@models/notification/notification.model";
const router = Router();



import { Middleware, RequestWithCurrentUser } from "@common/types.common";
import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import { GetNotificationsQueryValidationSchema } from "./validation/get_notifications.validation";
import { UnAuthorizedError } from "@core/errors";

const GetNotificationController:Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const limit = +(req.query.limit ?? "20");
  const skip = +(req.query.skip ?? "0");
  const {order, sortBy} = req.query as Record<string, any>;
  
	const sort: Record<string, any> = {};
	sort[sortBy ?? "created_at"]=order ?? "desc";

	const query = buildQuery(req);

	const totalDocumentsCount = await Notification.countDocuments(query)
	
  res.status(200).json({
    status: 200,
    data: await Notification.find(query).sort(sort).limit(limit).skip(skip).select("-is_deleted"),
		total: totalDocumentsCount
  });
};
router.get(
	"/",
  JOIValidateRequest(GetNotificationsQueryValidationSchema, "query"),
	GetNotificationController,
);

export { router as GetNotificationsRoute };

function buildQuery(req: RequestWithCurrentUser) {
	const { is_read } = req.query as Record<string, any>;
	const query: Record<string, any> = {
    is_deleted: false,
    user_id: req.currentUser!.auth_id,
  }

  if (typeof is_read !== "undefined") {
    query.is_read = is_read === true || is_read === "true";
  }

	return query;
}
