import { Router } from "express";

import { Task } from "@models/task/task.model";
import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
const router = Router();



import { Middleware, RequestWithCurrentUser } from "@common/types.common";
import { GetTasksQueryValidationSchema } from "./validation/get_tasks.validation";
import { UnAuthorizedError } from "@core/errors";

const GetTaskController:Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const limit = +(req.query.limit ?? "20");
  const skip = +(req.query.skip ?? "0");
  const {order, sortBy} = req.query as Record<string, any>;
  
	const sort: Record<string, any> = {};
	sort[sortBy ?? "created_at"]=order ?? "desc";

	const query = buildQuery(req);

	const totalDocumentsCount = await Task.countDocuments(query)
	
  res.status(200).json({
    status: 200,
    data: await Task.find(query).sort(sort).limit(limit).skip(skip).select("-is_deleted"),
		total: totalDocumentsCount
  });
};
router.get(
	"/",
	JOIValidateRequest(GetTasksQueryValidationSchema, "query"),
	GetTaskController,
);

export { router as GetTasksRoute };

function buildQuery(req: RequestWithCurrentUser) {
	const { status, priority } = req.query as Record<string, any>;
	const query: Record<string, any> = {
    is_deleted: false,
    user_id: req.currentUser!.auth_id,
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;

	return query;
}
