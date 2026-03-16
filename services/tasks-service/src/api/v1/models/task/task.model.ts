import mongoose from 'mongoose'
import { TaskDocument, CreateTaskData, TaskStatus, TaskPriority } from './interfaces/task_document.interface';
import { TaskModel } from './interfaces/task_model.interface';
import { TaskModelName } from '@common/models_names';


const schema = new mongoose.Schema<TaskDocument, TaskModel>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  },
  due_date: { type: Date },
  user_id: { type: String, required: true, index: true },
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})


schema.statics.build = (data: CreateTaskData) => new Task(data);

export const Task = mongoose.model<TaskDocument, TaskModel>(
  TaskModelName,
  schema
);