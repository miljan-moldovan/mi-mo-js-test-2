export interface ClientAppointment {
  date: string;
  start: string;
  end: string;
  storeId: number;
  storeName: string;
  employeeId: number;
  employeeName: string;
  serviceId: number;
  serviceDescription: string;
  clientId: number;
  clientName: string;
  requested: boolean;
  id: number;
  updateStamp: number;
  isDeleted: boolean;
}

export interface RetailHistoryItem {
  transaction: {
    date: string;
    id: number;
  };
  store: {
    name: string;
    id: number;
  };
  employee: {
    name: string;
    middleName: string;
    lastName: string;
    fullName: string;
    appointmentOrder: number;
    isReceptionist: boolean;
    displayColor: number;
    id: number;
  };
  inventoryItem: {
    productCode: string;
    upc: string;
    upC2: null;
    description: string;
    price: number;
    supplierName: string;
    firstItemCode: string;
    id: number;
  };
  quantity: number;
  total: number;
}
