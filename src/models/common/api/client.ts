export interface ClientQuery {
  filterRule?: string;
  filterValue?: string;
  skip?: number;
  maxCount?: number;
  sortOrder?: string;
  sortField?: string;
  fromAllStores?: boolean;
}
