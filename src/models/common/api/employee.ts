export interface ProviderRequest {
  serviceId?: number;
  query: ProviderQuery;
}

export interface ProviderQuery {
  filterRule?: 'contains' | 'none' | 'startsWith';
  filterValue?: string;
  skip?: number;
  maxCount?: number;
  sortOrder?: string;
  sortField?: string;
}
