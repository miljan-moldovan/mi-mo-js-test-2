export const areDatesInRange = (rangeStart, rangeEnd, startDate, endDate) =>
  (startDate.isSameOrAfter(rangeStart) && (endDate || startDate).isSameOrBefore(rangeEnd));

export default areDatesInRange;
