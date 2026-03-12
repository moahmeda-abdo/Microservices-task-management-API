import Joi from 'joi';
import { Middleware } from '../../../api/common/types.common';
import { JOIValidateRequest } from './joi-validate-request.middleware';
import { ObjectIdValidation } from '../../../api/common/validation/object_id.validation';
const validationSchema = Joi.object({
  w_id: ObjectIdValidation().required()
})
export const AssertWorkshopIdExistsInQuery: Middleware = JOIValidateRequest(validationSchema, "query");