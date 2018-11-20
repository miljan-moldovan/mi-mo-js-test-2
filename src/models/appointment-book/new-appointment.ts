import moment from 'moment';
import { Client, Provider, Service, ClientPhone, Resource, Room, PopulatedService } from 'models';
import { Maybe } from 'models';

export enum ConfirmationType {
  Email = 1,
  Sms = 5,
  DoNotConfirm = 7,
  EmailAndSms = 6,
}

export type Remote<T> = {
  isLoading: boolean;
  error: Maybe<Error>;
  data: Maybe<T>;
};

export type Subservice = {
  service: Service;
  type: string;
};

export type ServiceItem = {
  itemUuid: string;
  mainService?: ServiceItem;
  service: NewAppointmentService;
  details: Remote<NewAppointmentServiceDetails>;
};

export type NewAppointment = {
  date: Maybe<moment.Moment>;
  client: Maybe<Client>;
  bookedByEmployee: Maybe<Provider>;
  clientEmail: string;
  phones: ClientPhone[];
  confirmationType: ConfirmationType;
  displayColor: string;
  remarks: string;
  rebooked: boolean;
};

export type NewAppointmentService = {
  id?: Maybe<number>;
  client: Maybe<Client>;
  service: Maybe<PopulatedService>;
  provider: Maybe<Provider>;
  requested: boolean;
  bookBetween: boolean;
  fromTime: moment.Duration;
  toTime: moment.Duration;
  gapTime: Maybe<number>;
  afterTime: Maybe<number>;
  length: Maybe<number>;
  price: Maybe<number>;
  serviceType: string;
  room: Maybe<Room>;
  roomOrdinal: Maybe<number>;
  resource: Maybe<Resource>;
  resourceOrdinal: Maybe<number>;
  isFirstAvailable: boolean;
  gapEnabled: boolean;
};

export type NewAppointmentServiceDetails = {
  price: number;
  length: moment.Duration;
  conflicts: {message: string}[];
};

export type NewAppointmentRequestDataItem = {
  id?: number;
  clientId: number;
  serviceId: number;
  employeeId: number;
  requested: boolean;
  fromTime: string;
  toTime: string;
  bookBetween?: boolean;
  date?: string;
  gapTime?: string;
  afterTime?: string;
  roomId?: number;
  roomOrdinal?: number;
  resourceId?: number;
  resourceOrdinal?: number;
  primaryAppointmnetId?: number;
  bookedByEmployeeId?: number;
  isFirstAvailable: boolean;
};

export type NewAppointmentRequestData = {
  deletedIds?: number[];
  rebooked: boolean;
  dateRequired?: boolean;
  date: string;
  bookedByEmployeeId?: number;
  remarks: string;
  displayColor: string;
  recurring?: {
    repeatPeriod: number;
    endsAfterCount: number;
    endsOnDate: string;
  };
  clientInfo: {
    id: number;
    email?: string;
    phones: ClientPhone[];
    confirmationType?: number;
  },
  items: NewAppointmentRequestDataItem[];
};

export type ResponseZipCode = {
  city: string,
  id: number,
  isDeleted: boolean,
  latitude: number,
  longitude: number,
  state: string,
  updateStamp: number,
  zip: string
};
