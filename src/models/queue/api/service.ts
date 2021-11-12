export interface ReqUpdateServ {
  queueId?: number;
  employeeId?: number;
  serviceId?: number;
  serviceEmployeeId?: number;
  data?: {
    newServiceId: number;
  };
}
export interface ReqGetServsDD {
  queueId: number;
  serviceEmployeeId: number;
}

export interface ReqGetServsByEmplId {
  queueId: number;
  serviceEmployeeId: number;
}
