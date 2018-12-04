import { ProviderCompany, ProviderPosition } from '../common/employee';

export interface FilterOptions {
  company: ProviderCompany?,
  position: ProviderPosition?,
  showOffEmployees: boolean,
  showRoomAssignments: boolean,
  showAssistantAssignments: boolean,
  showFirstAvailable: boolean,
}
