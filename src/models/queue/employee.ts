import { Employee, Coords } from 'models';

export enum StateEmployee {
  NotStarted = 0,
  PunchedIn = 1,
  OnBreak = 2,
}

export enum OtherWorkTypes {
  RegularWork = 0,
  Desk = 1,
  Interview = 2,
  Meeting = 3,
  Paperwork = 4,
  Bank = 5,
  Training = 6,
  Other = 7
}

export interface EmployeesForDD {
  code?: string;
  appointmentOrder?: number;
  isReceptionist?: boolean;
  displayColor?: number;
  imagePath?: string;
  imageName?: string;
  firstName?:  string;
  middleName?: string;
  lastName: string;
  fullName: string;
  name: string;
  id: number;
  updateStamp?: number;
  isDeleted?: boolean;
}

export interface ProvidersForMerge {
  firstName: string;
  lastName: string;
  middleName: string;
  cellPhone: string;
  homePhone: string;
  workPhone: string;
  email: string;
  zip: number;
  lastVisitedStore: string;
  fullName: string;
  phone: string;
  id: number;
  updateStamp: number;
  isDeleted: boolean;
}

export interface QuickStaffData {
  employeeQuickStaff: Employee | null;
  isOpenQuickStaff: boolean;
  coordsQuicStaff: Coords;
}
