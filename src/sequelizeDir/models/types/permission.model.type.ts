import { RequiredKeyType } from '@sequelizeDir/models/types/index.model.type';

export type PermissionAttributesType = {
  id?: string;
  name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type RequiredPermissionAttributesType = RequiredKeyType<PermissionAttributesType, 'name'>;
