import { Router } from "express";
import { Notification } from "@models/notification/notification.model";
import { Middleware } from "@common/types.common";
import { UnAuthorizedError } from "@core/errors";

const router = Router();

const MarkAllNotificationsReadController: Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const result = await Notification.updateMany(
    {
      user_id: req.currentUser.auth_id,
      is_deleted: false,
      is_read: false,
    },
    {
      is_read: true,
      updated_at: new Date(),
    }
  );

  res.status(200).json({
    status: 200,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    },
  });
};

router.patch(
  "/read-all",
  MarkAllNotificationsReadController
);

export { router as MarkAllNotificationsReadRoute };
