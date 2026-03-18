import Joi from "joi";

export const GetNotificationsQueryValidationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "limit must be a number",
    "number.integer": "limit must be an integer",
    "number.min": "limit must be at least 1",
    "number.max": "limit must not exceed 100",
  }),
  skip: Joi.number().integer().min(0).optional().messages({
    "number.base": "skip must be a number",
    "number.integer": "skip must be an integer",
    "number.min": "skip must be 0 or greater",
  }),
  order: Joi.string().valid("asc", "desc").optional().messages({
    "string.base": "order must be a string",
    "any.only": "order must be either asc or desc",
  }),
  sortBy: Joi.string()
    .valid("type", "title", "message", "user_id", "is_read", "created_at", "updated_at")
    .optional()
    .messages({
      "string.base": "sortBy must be a string",
      "any.only": "sortBy must be one of: type, title, message, user_id, is_read, created_at, updated_at",
    }),
  is_read: Joi.boolean().optional().messages({
    "boolean.base": "is_read must be a boolean",
  }),
});
