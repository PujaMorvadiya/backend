export type availabilityDataType = {
  userId: string;
  startDate: string | Date;
  endDate: string | Date;
  timezone: string;
  week_days: number[];
  time_ranges: {
    start_time: string;
    end_time: string;
    timezone?: string;
  }[];
};