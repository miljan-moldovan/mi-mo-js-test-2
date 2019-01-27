import { QueueItem } from "./queue-item";

export interface CombiningClient {
  queueId: number;
  clientName: string;
  groupLead: boolean;
}

export interface QueueGroup {
  id: number;
  clientQueues: QueueItem[];
}