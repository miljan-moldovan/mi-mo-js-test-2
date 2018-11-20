import { Resource, Room, Provider, Service, Client, Reason } from 'models';
import { Maybe } from 'models';

interface CellContextMenuData {
  date: string;
  employee: Maybe<Provider>;
  time: {
    startTime: string;
    endTime: string;
  };
  resource?: Maybe<Resource>;
  room?: Maybe<Room>;
  ordinal?: Maybe<number>;
  service?: Service;
  client?: Client;
  isActiveEmployee?: boolean;
  isAvailabilityColumn?: boolean;
}

export interface OpenBookApptContextMenuData extends CellContextMenuData {
  rebooked: boolean;
  idCell: string;
}
export interface OpenCellContextMenuData extends CellContextMenuData {}
export interface BlockTimeCellContextMenuData extends CellContextMenuData {
  reason?: Reason;
  notes?: string;
  scheduleBlockId?: number;
}
export interface BookApptContextMenuData extends CellContextMenuData {
  rebooked: boolean;
  idCell: string;
}
