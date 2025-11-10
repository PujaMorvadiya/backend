import { RequiredKeyType } from './index.model.type';

export type RolesAttributesType = {
  id?: number;
  role: string;
  description?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type RequiredRolesAttributesType = RequiredKeyType<RolesAttributesType, 'role'>;
