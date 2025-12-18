import CommonQuery from "@/lib/query/commonQuery";
import BaseRepository from "@/modules/common/base.repository";
import Availabilities from "@/sequelizeDir/models/availability.model";
import { Request } from "express";
import { format, fromZonedTime } from 'date-fns-tz';
import { addDays, getDay, isAfter, isBefore, max, min } from "date-fns";
import { availabilityDataType } from "../interface/availability.interface";
import { HttpException } from "@/common/helper/response/httpException";
import { Includeable, Op, WhereOptions } from "sequelize";
import { AvailabilitiesAttributesType } from "@/sequelizeDir/models/types/availability.model.type";
import User from "@/sequelizeDir/models/user.model";

export default class AvailabilityService extends BaseRepository<Availabilities> {
    private readonly commonQuery = new CommonQuery(this.DBModel);
    constructor() {
        super(Availabilities.name);
    }

    public bulkCreateAvailability = async (
        req: Request,
        availabilityData: availabilityDataType,
        isAdmin: boolean = false
    ) => {
        const availabilitiesData = [];

        const { startDate, endDate, week_days, time_ranges, userId } = availabilityData;

        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let date = start; date <= end; date = addDays(date, 1)) {
            const weekday = getDay(date);
            if (!week_days.includes(weekday)) continue;

            const currentDateStr = format(date, 'yyyy-MM-dd');

            for (const range of time_ranges) {
                const tz = range.timezone;

                const startLocal = `${currentDateStr}T${range.start_time}`;
                let endLocal = `${currentDateStr}T${range.end_time}`;

                const [startHour] = range.start_time.split(':').map(Number);
                const [endHour] = range.end_time.split(':').map(Number);

                // handle overnight slots
                if (endHour < startHour) {
                    endLocal = `${format(addDays(date, 1), 'yyyy-MM-dd')}T${range.end_time}`;
                }

                const startUTC = fromZonedTime(startLocal, tz);
                const endUTC = fromZonedTime(endLocal, tz);

                availabilitiesData.push({
                    date: startUTC,
                    start_time: startUTC,
                    end_time: endUTC,
                    user_id: userId,
                    created_at: new Date(),
                    created_by: req.user?.id,
                    added_by_admin: isAdmin,
                    timezone: tz,
                });
            }
        }

        const availabilityExists = await Availabilities.findAll({
            where: { user_id: userId },
        });

        const filterAvailability = await this.removeOverlapAvailabilities(
            availabilitiesData,
            availabilityExists
        );

        // conflict check only for non-admin
        // if (!isAdmin) {
        await this.checkForConflicts(availabilitiesData, availabilityExists);
        // }

        if (filterAvailability.length > 0) {
            return await Availabilities.bulkCreate(filterAvailability);
        }

        return [];
    };

    public removeOverlapAvailabilities = async (availableData, availableExistData) => {
        const nonOverlapping = [];
        for (const data of availableData) {
            let newStart = new Date(data.start_time);
            let newEnd = new Date(data.end_time);
            for (const existData of availableExistData) {
                const existingStart = new Date(existData.start_time);
                const existingEnd = new Date(existData.end_time);
                const overlapStart = max([newStart, existingStart]);
                const overlapEnd = min([newEnd, existingEnd]);
                const hasOverlap = isBefore(overlapStart, overlapEnd);
                if (hasOverlap) {
                    if (!isBefore(newStart, existingStart) && !isAfter(newEnd, existingEnd)) {
                        newStart = newEnd;
                        break;
                    }
                    if (isBefore(newStart, existingStart) && isAfter(newEnd, existingStart)) {
                        newEnd = existingStart;
                    }

                    if (isBefore(newStart, existingEnd) && isAfter(newEnd, existingEnd)) {
                        newStart = existingEnd;
                    }
                }
            }
            if (isBefore(newStart, newEnd)) {
                nonOverlapping.push({
                    ...data,
                    start_time: newStart.toISOString(),
                    end_time: newEnd.toISOString(),
                });
            }
        }
        return nonOverlapping;
    };

    public checkForConflicts = async (data1, data2) => {
        for (const entry1 of data1) {
            for (const entry2 of data2) {
                const start1 = new Date(entry1.start_time);
                const end1 = new Date(entry1.end_time);
                const start2 = new Date(entry2.start_time);
                const end2 = new Date(entry2.end_time);

                // Check for time overlap
                if (start1 < end2 && start2 < end1) {
                    throw new HttpException(400, 'TIME_CONFLICT_ERROR', {}, true);
                }
            }
        }
    };

    public async handleAllAvailabilityData(req: Request) {
        const { query, user } = req;
        const { startDate, endDate, allAvailabilities } = query;

        const where: WhereOptions<AvailabilitiesAttributesType> = {};
        const include: Includeable | Includeable[] = [];
        const attributes = this.commonQuery.attributesSetter(req, ['date', 'start_time', 'end_time', 'user_id', 'id'], null);
        const pageParams = this.commonQuery.paginationSetter(req);
        this.commonQuery.conditionSetter(req, where, null);
        const order = this.commonQuery.orderSetter(req);

        if (startDate && endDate) {
            where[Op.or] = [
                {
                    start_time: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                },
                {
                    end_time: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                },
            ];

            if (allAvailabilities) {
                (where as any).user_id = user.id;
            } else {
                include.push({
                    model: User,
                    attributes: ['first_name', 'last_name', 'profile_image', 'full_name'],
                });
            }
        }

        const availabilityData = await this.DBModel.findAndCountAll({
            where,
            attributes,
            include,
            order,
            ...pageParams,
        });
        return this.commonQuery.dataSetter(req, availabilityData);
    }


}