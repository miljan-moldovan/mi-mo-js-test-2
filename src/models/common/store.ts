import { WeeklySchedule } from '@/models/index';
import { Maybe } from '../core';

export interface Store {
  id: number;
  name: string;
  timeZone: string;
  weeklySchedules: WeeklySchedule[];
  updateStamp: Maybe<number>;
  isDeleted: boolean;
}

export interface BlockType {
  id: number;
  name: string;
  isDeleted: boolean;
  updateStamp: Maybe<number>;
  defaultDuration: string;
}

export interface StoreCompany {
  id: number;
  name: string;
  isDeleted: boolean;
  updateStamp: Maybe<number>;
}

export interface StoreResource {
  id: number;
  name: string;
  isDeleted: boolean;
  updateStamp: Maybe<number>;
  resourceCount: Maybe<number>;
}

export interface StoreRoom {
  id: number;
  name: string;
  isDeleted: boolean;
  updateStamp: Maybe<number>;
  roomCount: Maybe<number>;
}

export interface ClientReferralType {
  id: number;
  name: string;
  isDeleted: boolean;
  updateStamp: Maybe<number>;
  sourceStoreId: Maybe<number>;
}