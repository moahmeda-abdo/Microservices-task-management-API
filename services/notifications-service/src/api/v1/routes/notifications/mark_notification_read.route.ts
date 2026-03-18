import Joi from "joi";
import { Router } from "express";
import { Notification } from "@models/notification/notification.model";
import { JOIValidateRequest } from "@core/middleware/validation/joi-validate-request.middleware";
import { Middleware } from "@common/types.common";
import { ObjectIdValidation } from "@common/validation/object_id.validation";
import { NotFoundError } from "@core/errors/not-found.error";
import { UnAuthorizedError } from "@core/errors";

const router = Router();

const MarkNotificationReadParamsValidationSchema = Joi.object({
  notificationId: ObjectIdValidation().required(),
});

const MarkNotificationReadController: Middleware = async (req, res) => {
  if (!req.currentUser?.auth_id) {
    throw new UnAuthorizedError("User is not authenticated");
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.notificationId,
      user_id: req.currentUser.auth_id,
      is_deleted: false,
    },
    {
      is_read: true,
      updated_at: new Date(),
    },
    { new: true }
  ).select("-is_deleted");

  if (!notification) {
    throw new NotFoundError("Notification Not Found");
  }

  res.status(200).json({
    status: 200,
    data: notification,
  });
};

router.patch(
  "/:notificationId/read",
  JOIValidateRequest(MarkNotificationReadParamsValidationSchema, "params"),
  MarkNotificationReadController
);

export { router as MarkNotificationReadRoute };
