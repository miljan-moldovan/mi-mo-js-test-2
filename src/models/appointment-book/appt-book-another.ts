import { Maybe, Client, Service, PureProvider, Room, Resource } from '@/models';

export interface BookAnotherAppointmentData {
  id?: number;
  service: Service;
  employee: PureProvider;
  room: Maybe<Room>;
  resource: Maybe<Resource>;
  roomOrdinal?: number;
  resourceOrdinal?: number;
  requested?: boolean;
  displayColor?: Maybe<string>;
  gapTime?: string;
  afterTime?: string;
}

export interface AppointmentBookAnother {
  isBookingAnother?: boolean;
  rebooked?: boolean;
  client: Client;
  appointments?: BookAnotherAppointmentData[];
}
