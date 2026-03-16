
import { Router } from 'express';

import { Task } from '@models/task/task.model';

import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import {ObjectIdRouteParamsValidationSchema} from "@common/validation/route_params.validation"

import { NotFoundError } from '@core/errors/not-found.error';
import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from '@core/errors';


const router =Router();


const TaskDetailsController: Middleware = async (req, res) => {
	if (!req.currentUser?.auth_id) {
		throw new UnAuthorizedError("User is not authenticated");
	}

	const id = req.params.id;
	const task = await Task.findOne({
		_id: id,
		user_id: req.currentUser.auth_id,
		is_deleted: false,
	}).select("-is_deleted");
	if (!task) throw new NotFoundError("Task Not Found");
	res.status(200).json({status: 200, data: task })
}

router.get(
	"/:id",
  JOIValidateRequest(ObjectIdRouteParamsValidationSchema, "params"),
	TaskDetailsController,
)

export {router as GetTaskDetailsRoute}
