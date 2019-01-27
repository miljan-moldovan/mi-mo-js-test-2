export interface ServiceConflictsResponse {
  response: {
    bookAnyway: boolean;
    canBeSkipped: boolean;
    date: string;
    duration: number;
    startTime: string;
    endTime: string;
    overlap: any;
    price: number;
    employeeFullName: string;
    reason: string;
    serviceDescription: string;
  }[];
}

export interface CheckConflictsParams {
  date: string;
  clientId: number;
  bookedByEmployeeId?: number;
  deletedIds?: number[];
  items: {
    appointmentId?: number;
    fromTime: string;
    toTime: string;
    gapTime?: string;
    afterTime?: string;
    bookBetween?: boolean;
    clientId: number;
    employeeId?: number;
    serviceId: number;
    isFirstAvailable?: boolean;
    roomId?: number;
    roomOrdinal?: number;
    resourceId?: number;
    resourceOrdinal?: number;
  }[];
}

export interface BlockTimeConflictsParams {
  scheduleBlockId?: number;
  date: string;
  fromTime:	string;
  toTime: string;
  employeeId: number;
  blockTypeId: number;
  bookedByEmployeeId: number;
}

export interface ConflictRequest {
  appointmentId: number;
  date: string;
  fromTime: string;
  toTime: string;
  gapTime: string;
  afterTime: string;
  bookBetween: boolean;
  employeeId: number;
  serviceId: number;
  clientId: number;
}

export interface ConflictResponse {
  bookAnyway: boolean;
  canBeSkipped: boolean;
  date: string;
  duration: number;
  employeeFullName: string;
  fromTime: string;
  overlap: null;
  price: number;
  reason: string;
  serviceDescription: string;
  toTime: string;
}
