import { Router } from 'express';
import { CreateTaskRoute } from './create_task.route';
import { DeleteTaskRoute } from './delete_task.route';
import { GetTasksRoute } from './get_tasks.route';
import { GetTaskDetailsRoute } from './get_task_details.route';
import { UpdateTaskRoute } from './update_task.route';
import { RequireAuth } from '@core/middleware/auth';
const router = Router();

router.use(RequireAuth);
router.use(CreateTaskRoute);
router.use(UpdateTaskRoute);
router.use(DeleteTaskRoute);
router.use(GetTasksRoute);
router.use(GetTaskDetailsRoute);

export {router as TasksRoutes}
