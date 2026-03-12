import { Model } from 'mongoose';
import { AuthDocument, CreateAuthData } from './auth_document.interface';
export interface AuthModel extends Model<AuthDocument> {
  build(data: CreateAuthData):AuthDocument
}