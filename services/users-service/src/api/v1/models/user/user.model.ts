import mongoose from 'mongoose'
import { UserDocument, CreateUserData } from './interfaces/user_document.interface';
import { UserModel } from './interfaces/user_model.interface';
import { UserModelName } from '@common/models_names';


const schema = new mongoose.Schema<UserDocument, UserModel>({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})


schema.statics.build = (data: CreateUserData) => new User(data);

export const User = mongoose.model<UserDocument, UserModel>(
  UserModelName,
  schema
);