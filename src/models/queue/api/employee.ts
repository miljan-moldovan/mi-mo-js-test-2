export interface ReqUpdateEmpl {
  queueId?: number;
  employeeId?: number;
  serviceId?: number;
  serviceEmployeeId?: number;
  data?: {
    newEmployeeId: number;
    isFirstAvailable?: boolean;
  };
}

export interface ReqGetEmplsDD {
  queueId: number;
  serviceId?: number;
  employeeId?: number;
}

export interface ReqGetEmplByServId {
  queueId: number;
  serviceId?: number;
  employeeId?: number;
}
