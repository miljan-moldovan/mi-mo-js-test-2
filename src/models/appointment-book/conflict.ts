export interface Conflict {
  date: string;
  employeeFullName: string;
  serviceDescription: string;
  fromTime: string;
  toTime: string;
  duration: number;
  price: number;
  overlap: any;
  reason: string;
  bookAnyway: false;
  canBeSkipped: false;
  associativeKey: string;
  notes: string;
}
