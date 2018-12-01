import { StateEmployee } from '@/models/queue';

export interface Employee {
  id: number;
  lastName: string;
  middleName: string | null;
  firstName: string;
  name: string;
  fullName: string;
  imagePath: string;
  imageName: string;
  storeId: number;
  hoursWorkedToday: number;
  retailSales: number;
  sales: any;
  serviceId: number;
  serviceSales: number;
  servicesPerHour: number;
  clientServiced: number;
  isDeleted: boolean;
  startTime: string;
  updateStamp: number;
  state: {
    currentState: StateEmployee;
    id: number;
    otherWorkType: number;
    isFinished: boolean;
    isClockedIn: boolean;
  };
}

export interface Provider {
  id: number;
  lastName?: string;
  middleName?: string;
  fullName?: string;
  name: string;
  imagePath?: string;
  isReceptionist?: boolean;
  displayColor?: number | string;
  code?: string;
}

export interface EmployeeForAvatar {
  id: number;
  displayColor: number;
  imagePath: string;
  imageName: string;
  name: string;
  firstName?: string;
  lastName: string;
  username?: string;
}

export interface PureProvider {
  appointmentOrder: number;
  displayColor: number;
  fullName: string;
  id: number;
  imageName: string;
  imagePath: string;
  inAppointmentBook: boolean;
  isReceptionist: boolean;
  lastName: string;
  middleName: string;
  name: string;
  code: string;
}

export interface ProviderPosition {
  id: number;
  name: string;
  isAssistant: boolean;
}

export interface ProviderCompany {
  id: number;
  name: string;
}
