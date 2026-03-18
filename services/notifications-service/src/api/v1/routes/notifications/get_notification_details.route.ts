
import { Router } from 'express';

import { Notification } from '@models/notification/notification.model';

import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import { ObjectIdRouteParamsValidationSchema } from "@common/validation/route_params.validation"

import { NotFoundError } from '@core/errors/not-found.error';
import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from '@core/errors';


const router = Router();


const NotificationDetailsController: Middleware = async (req, res) => {
	if (!req.currentUser?.auth_id) {
		throw new UnAuthorizedError("User is not authenticated");
	}

	const id = req.params.id;
	const notification = await Notification.findOne({
		_id: id,
		user_id: req.currentUser.auth_id,
		is_deleted: false,
	}).select("-is_deleted");
	
	if (!notification) throw new NotFoundError("Notification Not Found");
	res.status(200).json({ status: 200, data: notification })
}

router.get(
	"/:id",
	JOIValidateRequest(ObjectIdRouteParamsValidationSchema, "params"),
	NotificationDetailsController,
)

export { router as GetNotificationDetailsRoute }
