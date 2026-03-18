import { Router } from "express";
import { CreateTaskData } from "@models/task/interfaces/task_document.interface";
import { Task } from "@models/task/task.model";
import { Middleware } from "@common/types.common";
import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import { CreateTaskValidationSchema } from "./validation/create_task.validation";
import { UnAuthorizedError } from "@core/errors";
import { publishTaskCreated } from "../../../../events/publishers/task.created.publisher";
const router = Router();

const CreateTaskController: Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const data = req.body as RequestData;

  const buildData: CreateTaskData = {
    ...data,
    user_id: req.currentUser.auth_id,
  };

  const task = Task.build(buildData);
  await task.save();
  await publishTaskCreated(task);

  res.status(201).json({
    status: 201,
    data: task,
  });
};

router.post(
  "/",
  JOIValidateRequest(CreateTaskValidationSchema),
  CreateTaskController
);

export { router as CreateTaskRoute };

interface RequestData extends Omit<CreateTaskData, "user_id"> { }
