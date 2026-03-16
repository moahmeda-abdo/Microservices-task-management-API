import { Document } from 'mongoose'
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface TaskAttrs {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
  user_id: string;
}

export interface Task {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TaskDocument extends Task, Document { }

export type CreateTaskData = Omit<Task, 'created_at' | 'updated_at' | 'is_deleted'>

export type UpdateTaskData = Omit<Task, 'created_at' | 'is_deleted'>