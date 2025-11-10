import { RequiredKeyType } from './index.model.type';
import { RolesAttributesType } from './role.model.type';

export type UserRoleType = {
  id?: number;
  role_id?: string;
  user_id?: string;
  role?: Partial<RolesAttributesType>;
};

export type RequiredUserRoleTypeAttributesType = RequiredKeyType<UserRoleType, 'id'>;
