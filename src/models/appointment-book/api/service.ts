export interface PastService {
  date: string;
  employee: {
    id: number;
    isDeleted: boolean;
    name: string;
  };
  service: {
    id: number;
    isDeleted: boolean;
    name: string;
  };
  origPrice: number;
  priceEntered: number;
}

export interface ServiceCheck {
  employeeId: number;
  employeeFirstName: string;
  employeeMiddleName: string;
  employeeLastName: string;
  duration: string;
  price: number;
}
