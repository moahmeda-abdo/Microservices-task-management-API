import { Object_id_or_string } from '@common/types.common';
import { Document } from 'mongoose'

export interface User {
  user_id: Object_id_or_string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_deleted: boolean;
  updated_at: Date;
}

export interface UserDocument extends User, Document { }

export type CreateUserData = Omit<User, 'created_at' | 'updated_at' | 'is_deleted'>

export type UpdateUserData = Omit<User, 'created_at' | 'is_deleted'>