import { Model } from 'mongoose';
import { UserDocument, CreateUserData } from './user_document.interface';
export interface UserModel extends Model<UserDocument> {
  build(data: CreateUserData):UserDocument
}