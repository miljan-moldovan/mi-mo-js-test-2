export interface CurrentProvider {
  employeeId: number | null;
  removalReasonTypeId: number | null;
  isOtherReasonSelected: boolean;
  otherReason: string;
}

export interface ShortClient {
  idInQueue: number;
  name: string;
}

export interface WalkOutReasons {
  key: number;
  name: string;
  allowNoShow: boolean;
  allowWalkOut: boolean;
  allowRemoval: boolean;
  id: number;
  updateStamp: string;
  isDeleted: false;
}

export interface WalkInService {
  id: number | null;
  service: {
    id: number | null;
    label: string;
  };
  provider: {
    id: number | null;
    label: string;
  };
  isRequired: boolean;
}

export interface ClientInfoState {
  isOpen: boolean;
  clientId: number;
  clientName: string;
}

export interface WalkInData {
  serviceId: number;
  providerId: number;
  isProviderRequested: boolean;
  isFirstAvailable: boolean;
  clientId?: number;
  email?: string;
  phoneNumber?: string;
}

export interface DataProvider {
  provider: {
    id: number;
    label: string;
  };
  id: number;
}

export interface DataService {
  id: number;
  service: {
    id: number;
    label: string;
  };
}

export interface ProductEmployeeClientQueues {
  inventoryItemId: number;
  employeeId: number;
  promotionCode: string;
  updateStamp: number;
  isDeleted: boolean;
  id?: number;
  discount?: number;
  price?: string;
}
