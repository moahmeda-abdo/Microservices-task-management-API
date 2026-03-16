import { Router } from "express";
import { Task } from '@models/task/task.model';
import { UpdateTaskData } from "@models/task/interfaces/task_document.interface";
import { JOIValidateRequest } from '@core/middleware/validation/joi-validate-request.middleware';
import { UpdateTaskValidationSchema } from './validation/update_task.validation';
import { Middleware } from "@common/types.common";
import { NotFoundError } from '@core/errors/not-found.error';
import { ObjectIdRouteParamsValidationSchema } from "@common/validation/route_params.validation";
import { UnAuthorizedError } from "@core/errors";
import { publishTaskUpdated } from "src/events/publishers/task.updated.publisher";

const router = Router();


const UpdateTaskController: Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const data: RequestBody = req.body;

  const update: RequestBody & { updated_at: Date } = {
    ...data,
    updated_at: new Date()
  };

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.currentUser.auth_id,
      is_deleted: false,
    },
    update,
    { new: true }
  ).select("-is_deleted");

  if (!task) throw new NotFoundError("task Not Found With Given Id");
  await publishTaskUpdated(task);
  res.status(200).json({ status: 200, data: (task) })
}

router.put(
  "/:id",
  JOIValidateRequest(ObjectIdRouteParamsValidationSchema, "params"),
  JOIValidateRequest(UpdateTaskValidationSchema),
  UpdateTaskController
);


export { router as UpdateTaskRoute }


interface RequestBody extends Omit<UpdateTaskData, "user_id" | "updated_at"> { }
