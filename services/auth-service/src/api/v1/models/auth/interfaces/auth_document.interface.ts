import { Object_id_or_string } from '@common/types.common';
import mongoose, { Document } from 'mongoose'

export interface Auth {
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  user_id: Object_id_or_string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthDocument extends Auth, Document { 
  _id: mongoose.Types.ObjectId;
}

export type CreateAuthData = Omit<Auth, 'created_at' | 'updated_at' | 'is_deleted'>

export type UpdateAuthData = Omit<Auth, 'created_at' | 'is_deleted'>