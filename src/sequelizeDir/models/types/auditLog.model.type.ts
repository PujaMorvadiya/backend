import { PermissionEnum } from '@/common/constants/enum.constant';
import { RequiredKeyType } from './index.model.type';

export type AuditLogsAttributesType = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  language_id: string;
  permission_type: PermissionEnum;
  feature_id: string;
  detail: object;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type RequiredAuditLogsAttributesType = RequiredKeyType<AuditLogsAttributesType, 'id'>;
