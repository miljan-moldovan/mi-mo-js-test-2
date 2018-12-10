export interface QueueRemovalReasonType {
  id: number;
  key: number;
  name: string;
  isDeleted: boolean;
  updateStamp: number;
  allowNoShow: boolean;
  allowWalkOut: boolean;
  allowRemoval: boolean;
}