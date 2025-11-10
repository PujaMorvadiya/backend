import { generateSlugifyForModel } from '@/common/util';
import BaseRepository from '@/modules/common/base.repository';
import AuditLogs from '@/sequelizeDir/models/auditLog.model';
import { Request } from 'express';

export default class AuditLogRepository extends BaseRepository<AuditLogs> {
  constructor() {
    super(AuditLogs.name);
  }

  readonly createAuditLog = async (data, req?: Request): Promise<AuditLogs> => {
    try {
      const slug = await generateSlugifyForModel('audit_log', AuditLogs);
      const payload = {
        title: data.title,
        description: data.description,
        feature_id: data.feature_id,
        slug,
        user_id: data.user_id || null,
        language_id: data.language_id,
        created_at: new Date(),
        permission_type: data.permission_type,
        detail: data?.detail,
      };
      const dataData = await this.create(payload, req?.transaction ? { transaction: req?.transaction } : {});
      return dataData;
    } catch (error) {
      console.error('Create auditlog error : ', error);
    }
  };

  public async getAuditLog(userId: string) {
    return await this.DBModel.findOne({ where: { user_id: userId } });
  }
}
