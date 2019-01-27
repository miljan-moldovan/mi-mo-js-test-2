export interface  Promo {
  promotionCode: string;
  startDate: string;
  expirationDate: string;
  codeExpirationDays: string;
  promotionType: number;
  enabled: boolean;
  limitUsesType: number;
  limitUseCount: number;
  minLoyalty: any;
  minSpending: any;
  availabilityType: number;
  serviceDiscountAmount: number;
  retailDiscountAmount: number;
  giftCardDiscountAmount: number;
  name: string;
  id: number;
  updateStamp: number;
  isDeleted: boolean;
  title: string;
}

export enum PromotionType {
  ServiceProductPercentOff = 1, // serviceDiscountAmount percent in discount and  from price in price
  ServiceProductDollarOff = 2, // minus from price
  ServiceProductFixedPrice = 3,
  GiftCardPercentOff = 4,
  GiftCardDollarOff = 5
}
