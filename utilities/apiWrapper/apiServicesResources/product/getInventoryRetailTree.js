import { getApiInstance } from '../../api';

export default async () => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('Inventory/RetailTree', {})
    .then(({ data: { response } }) => response);
};
