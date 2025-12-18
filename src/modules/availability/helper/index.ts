import { addDays, endOfDay, isSameDay, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function handleCrossMidnight(
  { filter_start_time, filter_end_time }: { filter_start_time?: Date; filter_end_time?: Date },
  timeSlot: any,
  timezone: string,
  isCourse?: boolean
) {
  const slotData = timeSlot.dataValues ? { ...timeSlot.dataValues } : { ...timeSlot };

  const originalStart = slotData.start_time instanceof Date ? slotData.start_time : new Date(slotData.start_time);

  const originalEnd = slotData.end_time instanceof Date ? slotData.end_time : new Date(slotData.end_time);

  const startDate = toZonedTime(originalStart, timezone);
  const endDate = toZonedTime(originalEnd, timezone);

  let slots: any[] = [];

  if (!isSameDay(startDate, endDate)) {
    const firstSlotEndUTC = fromZonedTime(endOfDay(startDate), timezone);

    const firstSlot = {
      ...slotData,
      ...(!isCourse && { date: startDate.toISOString() }),
      start_time: originalStart.toISOString(),
      end_time: firstSlotEndUTC.toISOString(),
    };

    const nextDayStartUTC = fromZonedTime(startOfDay(addDays(startDate, 1)), timezone);

    const secondSlot = {
      ...slotData,
      ...(!isCourse && { date: addDays(startDate, 1).toISOString() }),
      start_time: nextDayStartUTC.toISOString(),
      end_time: originalEnd.toISOString(),
    };

    slots = [firstSlot, secondSlot];
  } else {
    slots = [slotData];
  }

  if (
    filter_start_time instanceof Date &&
    !isNaN(filter_start_time.getTime()) &&
    filter_end_time instanceof Date &&
    !isNaN(filter_end_time.getTime())
  ) {
    return slots.filter((slot) => {
      const slotStart = new Date(slot.start_time);
      const slotEnd = new Date(slot.end_time);
      return slotEnd > filter_start_time && slotStart < filter_end_time;
    });
  }

  return slots;
}