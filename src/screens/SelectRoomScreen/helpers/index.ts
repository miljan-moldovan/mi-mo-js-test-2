import { ServiceItem } from '@/models';
import { dateTimeConstants } from '@/constants';

export const getServiceName = (serviceItem: ServiceItem): string => {
  // tslint:disable-next-line:max-line-length
  const timeString = `${serviceItem.service.fromTime.format(dateTimeConstants.displayTime)} - ${serviceItem.service.toTime.format(dateTimeConstants.displayTime)}`;
  return `${serviceItem.service.service.name} - ${timeString}`;
}
