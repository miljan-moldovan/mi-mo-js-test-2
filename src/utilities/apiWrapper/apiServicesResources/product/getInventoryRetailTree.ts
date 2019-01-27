import { getApiInstance } from '../../api';
import { ProductCategories } from '@/models';

export default async (): Promise<ProductCategories[]> => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('Inventory/RetailTree', {})
    .then(({ data: { response } }) => response);
};
