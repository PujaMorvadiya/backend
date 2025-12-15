import { RequiredKeyType } from './index.model.type';

export type AvailabilitiesAttributesType = {
    id: string;
    user_id: string;
    date: Date | string;
    start_time: Date | string;
    end_time: Date | string;
    timezone?: string;
    availability_type: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string;
};

export type RequiredAvailabilitiesAttributesType = RequiredKeyType<AvailabilitiesAttributesType, 'id'>;
