import {
  BulkCreateArgs,
  CountArgs,
  CreateArgs,
  CreateOneOptions,
  DeleteArgs,
  FindAllArgs,
  FindAndCountAllArgs,
  FindOneArgs,
  RestoreArgs,
  UpdateOneArgs,
  UpdateOneOptions,
} from '@/common/interface/general/database.interface';
import User from '@/sequelizeDir/models/user.model';
import { parse } from '@common/util/index';
import _, { isNumber } from 'lodash';
import {
  BulkCreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Includeable,
  ModelAttributes,
  Optional,
  Sequelize,
  UpdateOptions,
  UpsertOptions,
  WhereOptions,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Col, Fn, Literal } from 'sequelize/types/utils';

export default class BaseRepository<M extends Model> {
  readonly DBModel: ModelCtor<M>;

  constructor(readonly modelName: string) {
    const db = require('@/sequelizeDir/models').default;
    this.DBModel = <ModelCtor<M>>db.models[modelName];
  }

  readonly get = async (data: Optional<FindOneArgs<M>, 'rejectOnEmpty'>) => {
    return this.DBModel.findOne({ ...data, rejectOnEmpty: false });
  };

  readonly sum = async (condition) => {
    const result = await this.DBModel.findAll({
      attributes: [[Sequelize.fn('COALESCE', Sequelize.col('total_amount_without_tax'), Sequelize.col('total_amount')), 'sum']],
      ...condition,
    });
    const sum = result.reduce((acc, res) => acc + res.dataValues.sum, 0);
    return sum;
  };

  readonly getAll = async (data: FindAllArgs<M>) => {
    return this.DBModel.findAll({ ...data, paranoid: false });
  };

  readonly create = async (data: CreateArgs<M>, options?: CreateOneOptions<M>) => {
    return this.DBModel.create(data, options);
  };

  readonly getCount = async (options?: CountArgs<M>) => {
    return this.DBModel.count(options);
  };

  readonly bulkCreate = async (data: BulkCreateArgs<M>, options?: BulkCreateOptions<M>) => {
    return this.DBModel.bulkCreate(data, options);
  };

  readonly update = async (data: UpdateOneArgs<M>, options?: Optional<UpdateOneOptions<M>, 'returning'>) => {
    return this.DBModel.update(data, { returning: true, individualHooks: false, ...options });
  };

  readonly upsert = async (data: CreateArgs<M>, options?: UpsertOptions<M>) => {
    return this.DBModel.upsert(data, { returning: true, ...options });
  };

  readonly deleteData = async (options: DeleteArgs<M>) => {
    return this.DBModel.destroy(options);
  };

  readonly restore = async (options: RestoreArgs<M>) => {
    return this.DBModel.restore(options);
  };

  readonly getAllData = async (options: FindAndCountAllArgs<M>) => {
    return this.DBModel.findAndCountAll({ ...options, distinct: true }).then((parseData) => parse(parseData));
  };

  readonly count = async (options: FindAndCountAllArgs<M>) => {
    return this.DBModel.count({ ...options, distinct: true }).then((parseData) => parse(parseData));
  };

  readonly findPage = async (
    conditions: WhereOptions = {},
    sortBy: Array<any> | Fn | Col | Literal = [['created_at', 'DESC']],
    page: number = 1,
    pageSize: number = 10,
    options: FindAndCountOptions = {}
  ) => {
    if (conditions) options.where = conditions;
    if (sortBy) options.order = sortBy;
    if (isNumber(page) && page > 0 && isNumber(pageSize) && pageSize > 0) {
      options.limit = pageSize;
      options.offset = (page - 1) * pageSize;
    }
    if (options.include && (options.include as Includeable[]).length > 0) {
      options.distinct = true;
    }
    const { count, rows } = await this.DBModel.findAndCountAll(options);
    const totalPages = Math.ceil(count / (options.limit || count));
    return {
      items: rows,
      totalCount: count,
      totalPages,
      currentPage: page,
      pageSize: options.limit,
    };
  };

  readonly increaseCount = async (fieldName: string, value: number, options?: UpdateOptions) => {
    return this.DBModel.increment(fieldName, { by: value, returning: true, ...options });
  };
}

export const setInstance = <ModelData extends Model & { _isAttribute?: (key: string) => boolean }>(
  data: Record<string, any>,
  model: ModelData
) => {
  Object.keys(data || {}).forEach((key) => {
    if (!_.isUndefined(data?.[key]) && model?._isAttribute?.(key)) {
      model[key] = data?.[key];
    }
  });
  return model;
};

export const getModel = <M extends Model>(modelName: string, dbI?: Sequelize) => {
  const DB: Sequelize = dbI || require('@/sequelizeDir/models')?.default;
  return <ModelCtor<M>>DB.models[modelName];
};

export interface CustomDestroyOptions<T extends Model = Model> extends DestroyOptions<ModelAttributes<T>> {
  user: User;
  ignoreValidation?: boolean;
}

export interface CustomUpdateOptions<T extends Model = Model> extends UpdateOptions<ModelAttributes<T>> {
  user: User;
  ignoreValidation?: boolean;
}

export interface CustomGetOptions<T extends Model = Model> extends FindOptions<ModelAttributes<T>> {
  req: Request;
  user: User;
  ignoreValidation?: boolean;
}

export interface CustomGetAllCountAllOptions<T extends Model = Model> extends FindAndCountOptions<ModelAttributes<T>> {
  req: Request;
  user: User;
  ignoreValidation?: boolean;
}
