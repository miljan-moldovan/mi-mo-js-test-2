import { Maybe, Promo, Provider } from '@/models';

export interface ProductBase {
  firstItemCode: number;
  id: number;
  isDeleted: boolean;
  name: string;
  price: number;
  productCode: string;
  supplierName: string;
  upC2: Maybe<string>;
  upc: string;
  productSize: string;
  updateStamp: number;
}

export interface QueueItemProduct {
  employee: Provider;
  id: number;
  isDeleted: boolean;
  product: ProductBase;
  promotion: Maybe<Promo>;
  updateStamp: number;
}
