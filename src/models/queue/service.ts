import { Employee } from 'models/common';

export interface ServiceQueue {
  id: number;
  employee: Employee;
  employeeLevelId: number | null;
  serviceId: number;
  serviceName: string;
  isFirstAvailable: boolean;
  isProviderRequested: boolean;
  initialPrice: number;
  promotion: Promotion | null;
  priceEntered: number;
  price: number;
  promoId: number;
  promoCode: {

  };
  countProductivity: boolean;
  computedPrice: number;
  allAdjustments: null;
  isDeleted: boolean;
}

export interface  Promotion {
  promotionCode: string;
  startDate: string;
  expirationDate: string;
  codeExpirationDays: any;
  promotionType: number;
  enabled: boolean;
  limitUsesType: number;
  limitUseCount: number;
  minLoyalty: number;
  minSpending: number;
  availabilityType: number;
  serviceDiscountAmount: number;
  retailDiscountAmount: number;
  giftCardDiscountAmount: number;
  name: string;
  id: number;
  updateStamp: number;
  isDeleted: boolean;
}
