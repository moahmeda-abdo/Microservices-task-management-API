import { Model } from 'mongoose';
import { TaskDocument, CreateTaskData } from './task_document.interface';
export interface TaskModel extends Model<TaskDocument> {
  build(data: CreateTaskData):TaskDocument
}