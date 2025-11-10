export function getDateDifference(date: Date | string) {
  const providedDate = new Date(date);
  const now = new Date();
  const yearDiff = now.getFullYear() - providedDate.getFullYear();
  const monthDiff = now.getMonth() - providedDate.getMonth();
  const dayDiff = now.getDate() - providedDate.getDate();

  return { yearDiff, monthDiff, dayDiff };
}
