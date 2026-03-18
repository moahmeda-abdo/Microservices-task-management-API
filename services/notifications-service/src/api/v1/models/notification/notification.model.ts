import mongoose from 'mongoose'
import { NotificationDocument, CreateNotificationData, NotificationType } from './interfaces/notification_document.interface';
import { NotificationModel } from './interfaces/notification_model.interface';
import { NotificationModelName } from '@common/models_names';


const schema = new mongoose.Schema<NotificationDocument, NotificationModel>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(NotificationType),
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  is_read: {
    type: Boolean,
    default: false,
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})


schema.statics.build = (data: CreateNotificationData) => new Notification(data);

export const Notification = mongoose.model<NotificationDocument, NotificationModel>(
  NotificationModelName,
  schema
);