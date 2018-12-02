import { BlockTimeConflictsParams } from '@/models';

export interface CreateBlockTypePayload {
  date: string;
  fromTime: string;
  toTime: string;
  notes: string;
  reasonId: number;
  employeeId: number;
  bookedByEmployeeId: number;
}

export interface ModifyBlockTypePayload {
  scheduleBlockId: number;
  date: string;
  fromTime: string;
  toTime: string;
  reasonId: number;
  notes: string;
  employeeId: number;
  bookedByEmployeeId: number;
}

export interface CreateBlockTypeParams {
  nameAction: string;
  payload: CreateBlockTypePayload;
  conflictData: BlockTimeConflictsParams;
}

export interface ModifyBlockTypeParams {
  nameAction: string;
  payload: ModifyBlockTypePayload;
  conflictData: BlockTimeConflictsParams;
}
