import Joi from "joi";
import { TaskPriority, TaskStatus } from "@models/task/interfaces/task_document.interface";

export const GetTasksQueryValidationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.base': 'limit must be a number',
    'number.integer': 'limit must be an integer',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must not exceed 100',
  }),
  skip: Joi.number().integer().min(0).optional().messages({
    'number.base': 'skip must be a number',
    'number.integer': 'skip must be an integer',
    'number.min': 'skip must be 0 or greater',
  }),
  order: Joi.string().valid("asc", "desc").optional().messages({
    'string.base': 'order must be a string',
    'any.only': 'order must be either asc or desc',
  }),
  sortBy: Joi.string()
    .valid("title", "status", "priority", "due_date", "user_id", "created_at", "updated_at")
    .optional()
    .messages({
      'string.base': 'sortBy must be a string',
      'any.only': 'sortBy must be one of: title, status, priority, due_date, user_id, created_at, updated_at',
    }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'string.base': 'status must be a string',
    'any.only': `status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional().messages({
    'string.base': 'priority must be a string',
    'any.only': `priority must be one of: ${Object.values(TaskPriority).join(', ')}`,
  }),
});
