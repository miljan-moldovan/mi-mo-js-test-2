export interface WalkInActions {
  setEstimatedTime: Function;
  setCurrentStep: Function;
  selectedClient: Function;
  selectService: Function;
  selectProvider: Function;
  selectPromotion: Function;
  postWalkinClient: Function;
}

export interface WalkInClient {
  id: number;
  name: string;
  middleName: string;
  lastName: string;
  email: string;
  phones: ClientPhone[],
}

export interface ClientPhone {
  type: number;
  value: string;
}

export interface WalkInService {
  name?: string;
  description?: string;
  price: number;
  length: any;
}

export interface WalkInProvider {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  isFirstAvailable?: boolean;
}

export interface ServiceItem {
  service: WalkInService | null;
  provider: WalkInProvider | null;
  isProviderRequested: boolean;
  isFirstAvailable?: boolean;
}
