import mongoose from 'mongoose'
import { AuthDocument, CreateAuthData } from './interfaces/auth_document.interface';
import { AuthModel } from './interfaces/auth_model.interface';
import { AuthModelName } from '@common/models_names';


const schema = new mongoose.Schema<AuthDocument, AuthModel>({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
  is_active: {type: Boolean, default: true},
  user_id : {type: mongoose.Schema.Types.ObjectId},
  is_deleted: {type: Boolean, default: false},
} , {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})


schema.statics.build = (data: CreateAuthData) => new Auth(data);

export const Auth = mongoose.model<AuthDocument, AuthModel>(
  AuthModelName,
  schema
);