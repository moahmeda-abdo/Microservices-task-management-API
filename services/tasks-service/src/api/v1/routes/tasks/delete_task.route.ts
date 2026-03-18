import { Router } from "express";
import { Task } from "@models/task/task.model";
import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import { ObjectIdRouteParamsValidationSchema } from "@common/validation/route_params.validation"
import { Middleware } from "@common/types.common";
import { NotFoundError } from "@core/errors/not-found.error";
import { UnAuthorizedError } from "@core/errors";
import { publishTaskDeleted } from "../../../../events/publishers/task.deleted.publisher";

const router = Router();

const DeleteTaskController: Middleware = async (req, res) => {
	if (!req.currentUser?.auth_id) {
		throw new UnAuthorizedError("User is not authenticated");
	}

	const id = req.params.id as string;
	const task = await Task.findOneAndUpdate(
		{ _id: id, user_id: req.currentUser.auth_id, is_deleted: false },
		{ is_deleted: true },
	);
	if (!task) throw new NotFoundError("task Not Found With Given Id");
	await publishTaskDeleted(task);

	res.status(204).end()
}

router.delete(
	"/:id",
	JOIValidateRequest(ObjectIdRouteParamsValidationSchema, "params"),
	DeleteTaskController,
);
export { router as DeleteTaskRoute }
