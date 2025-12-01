import { parseData } from '@/common/util';
import { Request } from 'express';
import _ from 'lodash';
import { literal, Op, Order, OrderItem, WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Fn, Where } from 'sequelize/types/utils';

type Literal = ReturnType<typeof literal>;
type AttributeType = string | [string | Literal, string] | Literal;

export default class CommonQuery<M extends Model> {
    private readonly model: ModelCtor<M>;

    constructor(model: ModelCtor<M>) {
        this.model = model;
    }

    private readonly getAssociationField = (fieldName: string) => {
        fieldName = fieldName.replaceAll('$', '');
        const fields = fieldName.split('.');

        let targetModel: any = this.model;

        for (let i = 0; i < fields.length - 1; i++) {
            const field = fields[i];

            targetModel = targetModel?.associations[field]?.target;

            if (!targetModel) {
                return null;
            }
        }

        return targetModel?.getAttributes()?.[fields.pop()] ?? null;
    };

    private readonly validateFields = (searchFields: string) => {
        const splitFields = (searchFields || '').split(',');
        const validFields = (splitFields || []).filter((field: string) => this.model.getAttributes()[field]);
        const associatedFields = _.chain(splitFields || [])
            .filter(
                (field) =>
                    !!(field?.split('.')?.length > 1 && field.startsWith('$') && field.endsWith('$') && this.getAssociationField(field))
            )
            .value();
        return (validFields || []).concat(associatedFields || []);
    };

    public readonly paginationSetter = (req: Request) => {
        const query = req.query;
        const page: number = query?.page ? Number(query.page) : 1;
        const limit: number = query?.limit ? Number(query.limit) : 10;
        const offset = (page - 1) * limit;

        if (!!query.view || !!query.dropdown) {
            return null;
        }

        return {
            page,
            limit,
            offset,
        };
    };

    public readonly conditionSetter = (
        req: Request,
        where: WhereOptions<unknown>,
        searchFields: string | null,
        extraSearchAttributeToAdd?: Where[]
    ) => {
        const searchText = req.query.search;
        const validFields = this.validateFields(searchFields);
        if (searchText && validFields && (validFields.length > 0 || extraSearchAttributeToAdd?.length > 0)) {
            if (!where[Op.or]) {
                where[Op.or] = [];
            }
            if (validFields && validFields.length > 0) {
                for (const validField of validFields) {
                    const field = validField.startsWith('$')
                        ? this.getAssociationField(validField)
                        : this.model.getAttributes()[validField];

                    if (field) {
                        switch (field?.type?.constructor?.name) {
                            case 'STRING':
                            case 'TEXT':
                                where[Op.or].push({
                                    [validField]: { [Op.iLike]: `%${searchText?.toString()?.trim()}%` },
                                });
                                break;
                            case 'INTEGER':
                            case 'UUID':
                                where[Op.or].push({
                                    [validField]: searchText,
                                });
                                break;
                            case 'DATE':
                                const searchDate = new Date(searchText.toString());
                                const isValidDate = !isNaN(searchDate.getTime());

                                if (isValidDate) {
                                    where[Op.or].push({
                                        [validField]: {
                                            [Op.gte]: searchDate,
                                        },
                                    });
                                }
                        }
                    }
                }
            }
            if (extraSearchAttributeToAdd && extraSearchAttributeToAdd.length > 0) {
                where[Op.or].push(...extraSearchAttributeToAdd);
            }
        }
        if (req?.query?.id && this.model.getAttributes()?.['id']) {
            where['id'] = req.query.id.toString();
        }

        if (req?.query?.slug && this.model.getAttributes()?.['slug']) {
            where['slug'] = req.query.slug.toString();
        }
    };

    public readonly orderSetter = (req: Request, defaultOrders: OrderItem[] = [['updated_at', 'DESC']]) => {
        const order: Order = [];
        const { sort } = req.query;

        if (!sort) {
            for (const defaultOrder of defaultOrders) {
                if (this.model.getAttributes()[defaultOrder[0]]) {
                    order.push(defaultOrder);
                }
            }
            return order;
        }

        const sortField = (sort as string).replace('-', '');
        const sortType = sort[0] === '-' ? 'DESC' : 'ASC';

        if (!this.model.getAttributes()[sortField]) {
            return;
        }
        order.push([sortField, sortType]);

        return order;
    };

    public readonly dataSetter = (req: Request, data: { rows: any[]; count: number }) => {
        const { rows, count } = data;
        const query = req.query;
        if (query?.dropdown) {
            return parseData(rows).map((row) => ({ label: row.label, value: row.value }));
        }
        if (query.slug || query.id) {
            return rows.length > 1 ? rows : rows[0]?.dataValues ? rows[0].dataValues : rows[0];
        }

        if (!!query.view) {
            return {
                data: rows,
            };
        }
        const pageParams = this.paginationSetter(req);
        return {
            data: rows,
            currentPage: pageParams.page,
            lastPage: pageParams.limit ? Math.ceil(count / Number(pageParams.limit)) : undefined,
            count: count,
            limit: pageParams.limit,
        };
    };

    public readonly attributesSetter = (
        req: Request,
        attributes: AttributeType[],
        dropdownFields: { label: string | Fn; value: string } | null
    ) => {
        const query = req.query;
        if (query?.dropdown) {
            const label =
                query?.label?.toString() && this.model.getAttributes()?.[query.label.toString()]
                    ? query.label.toString()
                    : dropdownFields.label;
            const value =
                query?.value?.toString() && this.model.getAttributes()?.[query.value.toString()]
                    ? query.value.toString()
                    : dropdownFields.value;
            // If label is of type Fn, return it directly
            if (typeof label === 'object' && label?.constructor?.name === 'Fn') {
                return [
                    [label, 'label'],
                    [value, 'value'],
                ];
            } else if (this.model.getAttributes()[label.toString()] && this.model.getAttributes()[value]) {
                return [
                    [label, 'label'],
                    [value, 'value'],
                ];
            }
        }

        if (attributes?.length > 0) {
            const validateFields: AttributeType[] = [];

            for (const attribute of attributes) {
                if (Array.isArray(attribute) && (typeof attribute[0] === 'string' || attribute?.[0]?.constructor.name === 'Literal')) {
                    validateFields.push([attribute[0], attribute[1]]);
                } else if (typeof attribute === 'string' && this.model.getAttributes()[attribute]) {
                    validateFields.push(attribute as string);
                } else if (attribute?.constructor.name === 'Literal') {
                    validateFields.push(attribute);
                }
            }
            return validateFields as any;
        }

        return Object.keys(this.model.getAttributes());
    };
}
