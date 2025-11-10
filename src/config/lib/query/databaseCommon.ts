import AuditLogRepository from '@/modules/auditLog/service/auditLog.repository';
import Feature from '@/sequelizeDir/models/feature.model';
import { parse } from '@common/util';
import { Transaction } from 'sequelize';

export function logMessageSetter(message, dynamicData) {
  Object.keys(dynamicData).forEach((key) => {
    const placeholder = `{{${key}}}`;
    message = message.replace(new RegExp(placeholder, 'g'), dynamicData[key]);
  });
  return message;
}

export const createLogMessage = async (
  req: any,
  messageSet: string,
  featureName: string,
  titleName: string,
  additionalProps?: {
    additionalMessageProps?: object;
    languageData?: { language_considered?: boolean; language_id?: string };
    transaction?: Transaction;
  },
  permissionType?: string,
  values?: object
) => {
  try {
    const description = logMessageSetter(messageSet, {
      ...(additionalProps && additionalProps?.additionalMessageProps),
    });
    const feature = await Feature.findOne({ where: { name: featureName }, attributes: ['id'] });
    const logPayload = {
      title: titleName,
      description: description,
      feature_id: feature.id,
      user_id: parse(req?.user ?? {}) ? parse(req?.user ?? {})?.id : 1,
      is_language_considered: additionalProps?.languageData?.language_considered || false,
      language_id: additionalProps?.languageData?.language_id,
      permission_type: permissionType,
      detail: values,
    };
    const logRepo = new AuditLogRepository();
    await logRepo.createAuditLog(logPayload, req);
  } catch (error) {
    console.error('createLogMessage Error', error);
  }
};
