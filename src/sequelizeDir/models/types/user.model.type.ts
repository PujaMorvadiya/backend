import { RequiredKeyType } from './index.model.type';
import { UserRoleType } from './userRole.model.type';

export type UserAttributesType = {
  id?: string;
  email: string;
  date_of_birth?: Date;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  password?: string;
  profile_image?: string;
  is_active?: boolean;
  phone_number?: string;
  address?: string;
  last_logged_in?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deleted_at?: Date | string;
  user_role?: Partial<UserRoleType>;
};

export type RequiredUserAttributesType = RequiredKeyType<UserAttributesType, 'email'>;
