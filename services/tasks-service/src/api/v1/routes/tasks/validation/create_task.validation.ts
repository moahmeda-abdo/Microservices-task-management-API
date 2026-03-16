import Joi from 'joi';
import { TaskPriority, TaskStatus } from '@models/task/interfaces/task_document.interface';

export const CreateTaskValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required().messages({
    'string.base': 'title must be a string',
    'string.empty': 'title is required',
    'string.min': 'title is required',
    'string.max': 'title must not exceed 255 characters',
    'any.required': 'title is required',
  }),
  description: Joi.string().trim().max(2000).optional().messages({
    'string.base': 'description must be a string',
    'string.max': 'description must not exceed 2000 characters',
  }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'string.base': 'status must be a string',
    'any.only': `status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional().messages({
    'string.base': 'priority must be a string',
    'any.only': `priority must be one of: ${Object.values(TaskPriority).join(', ')}`,
  }),
  due_date: Joi.date().iso().optional().messages({
    'date.base': 'due_date must be a valid date',
    'date.format': 'due_date must be in ISO format',
  }),
});
