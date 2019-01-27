import { RoomType } from '@/models';
import { Action } from 'redux';

export interface Addon {
  addBefore: boolean;
  displayOrder: number;
  id: number;
  parentServiceId: number;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  bookBetween?: boolean;
  canBePerformed: boolean;
  isAddon: boolean;
  isDeleted: boolean;
  maxDuration: string | null;
  minDuration: string | null;
  duration?: string;
  requiredServices?: Addon[];
  addons?: Addon[];
  recommendedServices?: Addon[];
  updateStamp: number | null;
  length?: number;
  orderDetails?: Addon;
  price: number;
  requireResource: boolean;
  requireRoom: RoomType | number;
  requiredResourceId: number;
  supportedRooms: { id: number, name: string }[];
  supportedResource: { id: number, name: string };
  afterDuration: string;
  gapDuration: string;
  serviceCode: string;
}

export interface ServiceCategories {
  id: number;
  name: string;
  services: Service[];
}

export interface ServiceAction extends Action {
  [key: string]: any;
}

export interface PopulatedService extends Service {
  populated_addons: Service[];
  populated_requiredServices: Service[];
  populated_recommendedServices: Service[];
}
