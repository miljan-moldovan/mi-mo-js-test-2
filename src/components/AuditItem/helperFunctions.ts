import moment from 'moment';

const AuditType = {
  NULL: -1,
  Normal: 0,
  Change: 1,
  Cancel: 2,
  ReviewWeb: 10,
};

const DateTime = {
  time: 'HH:mm:ss',
  timeOld: 'HH:mm',
  displayTime: 'hh:mm A',
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DDT00:00:00',
  serverDateTime: 'YYYY-MM-DDTHH:mm:ss',
};

export const getAuditType = (auditType?: number):string => {
  switch (auditType) {
    case AuditType.Normal:
      return 'BOOKED';
    case AuditType.Change:
      return 'MODIFIED';
    case AuditType.Cancel:
      return 'CANCEL';
    case AuditType.ReviewWeb:
      return 'REVIEW-WEB';
    default:
      return '--';
  }
};

export const formatDate = (date: string):string =>
  moment(date, DateTime.date).format('MM/DD/YYYY');

export const formatTime = (time: string):string =>
  moment(time, DateTime.time).format(DateTime.displayTime);

export const formatTimeWithMinutes = (time: string):string =>
  moment(time, DateTime.serverDateTime).format(DateTime.displayTime);

export const formatEmployeeName = (employee?: string):string => {
  if (!employee) {
    return '';
  }
  const splitName = employee.split(' ');
  switch (splitName.length) {
    case 1:
      return splitName[0];
    case 2:
      return `${splitName[0]} ${splitName[1][0]}`;
    default:
      return `${splitName[0]} ${splitName[2][0]}`;
  }
};
