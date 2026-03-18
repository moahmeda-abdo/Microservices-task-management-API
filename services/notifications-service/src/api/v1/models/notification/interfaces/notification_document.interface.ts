import { Document } from 'mongoose'

export enum NotificationType {
  TASK_CREATED = "task.created",
  TASK_UPDATED = "task.updated",
  TASK_DELETED = "task.deleted",
}
export interface NotificationAttrs {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read?: boolean;
  metadata?: Record<string, any>;
}

export interface Notification {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationDocument extends Notification, Document {}

export type CreateNotificationData = NotificationAttrs

export type UpdateNotificationData = Partial<
  Omit<
    Notification,
    'createdAt' | 'updatedAt' | 'created_at' | 'updated_at' | 'is_deleted'
  >
> & {
  updated_at?: Date;
}
