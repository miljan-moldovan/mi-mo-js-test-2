import { Moment, Duration } from 'moment';
import { NavigationScreenProp } from 'react-navigation';
import { RoomAssignmentActions } from '@/redux/actions/roomAssignment';
import { RoomAssignmentReducer } from '@/redux/reducers/roomAssignment';
import { ApptBookActions } from '@/redux/actions/appointmentBook';
import { RoomFromApi, Employee, Room, EmployeeSchedule, Maybe, Dictionary } from '@/models';

export interface RoomAssignmentScreenNavigationParams {
  dismissOnSelect?: boolean;
  date: Moment;
  canSave: boolean;
  employee: Employee;
  handleSave: () => void;
}

export interface RoomAssignmentScreenProps {
  id: number;
  isOpen: boolean;
  step: number;
  rooms: RoomFromApi[];
  getRooms: () => void;
  chunkedSchedule: Moment[];
  navigation: NavigationScreenProp<RoomAssignmentScreenNavigationParams>;
  appointmentCalendarActions: ApptBookActions;
  roomAssignmentActions: RoomAssignmentActions;
  roomAssignmentState: RoomAssignmentReducer;
}

export interface RoomItem {
  itemId: string;
  room: Maybe<Room>;
  roomId?: number;
  roomOrdinal: number;
  fromTime: Maybe<Moment>;
  toTime: Maybe<Moment>;
  isIncomplete: boolean;
}

export interface Interval {
  fromTime: Moment;
  toTime: Moment;
}

export interface RoomAssignmentScreenState {
  isLoading: boolean;
  schedule?: EmployeeSchedule;
  rooms?: Room[];
  toast: any;
  pickerType: 'room' | 'fromTime' | 'toTime';
  roomItems: RoomItem[];
  availableIntervals: Dictionary<Interval[]>;
  isModalPickerVisible: boolean;
  currentOpenAssignment: string;
  employeeScheduledIntervals: Moment[];
}

export interface AssignmentFormProps {
  assignment: RoomItem;
  onPressRoom: (roomId: string) => void;
  onPressFromTime: (roomId: string) => void;
  onPressToTime: (roomId: string) => void;
}
