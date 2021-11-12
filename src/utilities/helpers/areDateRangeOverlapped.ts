import { getRangeExtendedMoment } from './getRangeExtendedMoment';

const extendedMoment = getRangeExtendedMoment();

/**
 * Checks if two date ranges overlap
 */
export const areDateRangeOverlapped = (start1, end1, start2, end2) => {
  const range1 = extendedMoment.range(start1, end1);
  const range2 = extendedMoment.range(start2, end2);

  return range1.overlaps(range2);
};

export default areDateRangeOverlapped;
