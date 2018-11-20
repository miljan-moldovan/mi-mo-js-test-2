export interface GroupClient {
  queueId: number;
  isGroupLeader: boolean;
}

export interface Group {
  color: GroupColor;
  clients: GroupClient[];
  groupLeadName: string;
}

export interface Groups {
  [key: string]: Group;
}
export interface GroupColor {
  backgroundColor: string;
  border: string;
  borderColor: string;
}
