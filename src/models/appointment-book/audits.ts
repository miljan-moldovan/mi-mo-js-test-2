export enum AuditType {
  NULL = -1,
  Normal = 0,
  Change = 1,
  Cancel = 2,
  ReviewWeb = 10
}

export interface AuditAppt {
  id: number;
  auditType: AuditType;
  auditDateTime: string;
  auditEmployee: {
    name: string;
    id: number;
    updateStamp: number;
    isDeleted: boolean
  };
  appointmentId: number;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  provider: {
    name: string;
    id: number;
    updateStamp: number;
    isDeleted: boolean
  };
  service: {
    name: string;
    id: number;
    updateStamp: number;
    isDeleted: boolean
  };
}

export interface AuditBlockTime {
  id: number;
  auditType: AuditType;
  auditDate: string;
  auditDateTime: string;
  auditEmployee: {
    name: string;
    id: number;
    updateStamp: number;
    isDeleted: boolean;
  };
  scheduleBlockId: number;
  scheduleBlockDate: string;
  scheduleBlockStartTime: string;
  scheduleBlockEndTime: string;
  provider: {
    name: string;
    id: number;
    updateStamp: number;
    isDeleted: boolean
  };
  scheduleBlockName: string;
}

export type CommonAudit = AuditAppt & AuditBlockTime;
