import { RequiredKeyType } from './index.model.type';

export type RolePermissionsAttributesType = {
  id: string;
  role_id: number;
  feature_id: number;
  permission_id: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type RequiredRolePermissionsAttributesType = RequiredKeyType<RolePermissionsAttributesType, 'id'>;
