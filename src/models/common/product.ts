import { ProductBase } from 'models';

export interface Product {
  id: number;
  lastName: string;
  middleName: string;
  name: string;
  imagePath: string;
  storeId: number;
  serviceId: number;
}

export interface ProductCategories {
  id: number;
  name: string;
  inventoryItems: ProductBase[];
  isDeleted: boolean;
  updateStamp: number | null;
}
