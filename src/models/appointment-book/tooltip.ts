import { Coords, CommonCard, AppointmentEmployee, AppointmentGridEmployeeFilters, Maybe, Room, Resource } from 'models';

export interface TooltipState {
  isOpen?: boolean;
  coords: Coords;
  payload: Partial<PayloadCellTooltip & PayloadCardTooltip>;
  employeesFiltersByServiceInHeader?: AppointmentGridEmployeeFilters;
  trgBottom?: boolean;
}

export interface PayloadCellTooltip {
  isActiveEmployee: boolean;
  isCloseStore: boolean;
  employee: AppointmentEmployee;
  startTime: string;
  room: Maybe<Room>;
  resource: Maybe<Resource>;
  ordinal: Maybe<number>;
}

export interface PayloadCardTooltip {
  card: CommonCard;
}
