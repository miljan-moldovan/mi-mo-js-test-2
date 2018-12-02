import { ConfirmationType, Provider, Maybe } from '@/models';

export enum ClientPhoneType {
  Cell = 2,
  Home = 1,
  Work = 0
}

export interface InfoClient {
  email: string;
  phone: string;
  formatedPhone?: string;
}

export interface ClientPhone {
  type: ClientPhoneType;
  value: string;
}

export interface ClientAddress {
  city: Maybe<string>;
  state: Maybe<string>;
  zipCode: Maybe<string>;
  street1: Maybe<string>;
  street2: Maybe<string>;
}

export interface Client {
  address: ClientAddress;
  attributes: any[];
  email: string;
  id: number;
  name: string;
  lastName: string;
  fullName: string;
  middleName: Maybe<string>;
  visit: string;
  notes: string;
  phones: ClientPhone[];
  isDeleted: boolean;
  clientCode: string;
  birthday: Date;
}

export interface ClientDetailed {
  address: ClientAddress;
  attributes: any[];
  email: string;
  id: number;
  name: string;
  lastName: string;
  fullName: string;
  visit: string;
  notes: string;
  phones: ClientPhone[];
  isDeleted: boolean;
  clientCode: string;
  birthday: Date;
  middleName: string;
  age: number;
  gender: number;
  loyaltyNumber: string;
  confirmBy: number;
  clientPreferenceProviderType: number;
  preferredProviderId: number;
  referredByClientId: number;
  clientReferralTypeId: number;
  anniversary: Date;
  receivesEmail: true;
  requireCard: true;
  occupationId: number;
  confirmationNote: string;
  profilePhotoUuid: string;
}

export interface ClientContactInfo {
  id: number;
  email: string;
  phones: ClientPhone[];
  confirmationType: ConfirmationType;
}

export interface DataMessageClientsModal {
  employee: Provider;
  date: string;
}

export interface ClientEditResponse {
  id: number;
  name: string;
  middleName: string;
  lastName: string;
  isDeleted: boolean;
  updateStamp: number;
}

export interface ClientCreateResponse extends ClientEditResponse {
  bookedbyUuid: string;
}
