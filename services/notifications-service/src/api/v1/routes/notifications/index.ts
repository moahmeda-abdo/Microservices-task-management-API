import { Router } from 'express';
import { GetNotificationsRoute } from './get_notifications.route';
import { GetNotificationDetailsRoute } from './get_notification_details.route';
import { MarkAllNotificationsReadRoute } from './mark_all_notifications_read.route';
import { MarkNotificationReadRoute } from './mark_notification_read.route';
import { RequireAuth } from '@core/middleware/auth';
const router = Router();

router.use(RequireAuth);
router.use(MarkAllNotificationsReadRoute);
router.use(MarkNotificationReadRoute);
router.use(GetNotificationsRoute);
router.use(GetNotificationDetailsRoute);

export {router as NotificationsRoutes}
