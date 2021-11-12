export interface ServiceEmployeePrices {
  serviceId: number;
  employeeId: number;
  promotionCode: string;
  isFirstAvailable: boolean;
  associativeUid: string;
}

export interface ProductEmployeePrices {
  inventoryItemId: number;
  employeeId: number;
  promotionCode: string;
  associativeUid: string;
}

export interface CalculatePricesParams {
  clientId: number;
  serviceEmployeePrices: ServiceEmployeePrices[];
  productEmployeePrices: ProductEmployeePrices[];
}
