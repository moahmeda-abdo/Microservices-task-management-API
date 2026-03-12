import Joi from "joi";
import mongoose from 'mongoose';

export function ObjectIdValidation() {
    return Joi.custom((value, helpers) => {
        if (mongoose.isValidObjectId(value)) return value;
        return helpers.error('Invalid Id Pattern')
    })
}