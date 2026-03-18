import { Model } from 'mongoose';
import { NotificationDocument, CreateNotificationData } from './notification_document.interface';
export interface NotificationModel extends Model<NotificationDocument> {
  build(data: CreateNotificationData):NotificationDocument
}