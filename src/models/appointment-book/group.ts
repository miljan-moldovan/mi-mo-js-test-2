import { GroupClient } from '@/models';

export interface AppointmentGroup {
  clients: GroupClient[];
  groupLeadName: string;
}

export interface AppointmentGroups {
  [key: string]: AppointmentGroup;
}
