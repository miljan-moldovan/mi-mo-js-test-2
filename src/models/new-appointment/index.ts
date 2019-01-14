import moment from 'moment';
import { ApptBookReducer } from '@/redux/reducers/appointmentBook';
import { NewAppointmentReducer } from '@/redux/reducers/newAppointment';
import { SettingsReducer } from '@/redux/reducers/settings';
import { FormulasAndNotesReducer } from '@/redux/reducers/formulasAndNotes';
import { NavigationScreenProp } from 'react-navigation';
import { Service, PureProvider, ClientPhoneType, StoreResource } from '../common';
import { Maybe } from '../core';
import { NewApptActions } from '@/redux/actions/newAppointment';
import { Resource, Room } from '../appointment-book';
import { ApptBookActions } from '@/redux/actions/appointmentBook';
import { FormulasAndNotesActions } from '@/redux/actions/formulasAndNotes';
import { ServicesActions } from '@/redux/actions/service';

export type NewAppointmentScreenNavigationParams = {
  editMode: 'new' | 'edit';
  rebook: boolean;
  canSave: boolean;
  handleCancel: () => void;
  handleSave: () => void;
};

export type NewAppointmentScreenProps = {
  navigation: NavigationScreenProp<NewAppointmentScreenNavigationParams>;
  newAppointmentActions: NewApptActions;
  newAppointmentState: NewAppointmentReducer;
  apptBookActions: ApptBookActions;
  formulaActions: FormulasAndNotesActions;
  apptBookState: ApptBookReducer;
  settingState: SettingsReducer;
  formulasAndNotesState: FormulasAndNotesReducer;
  getEndTime: moment.Moment;
  totalPrice: number;
  appointmentLength: moment.Duration;
  isValidAppointment: boolean;
  appointmentScreenState: ApptBookReducer;
  servicesActions: ServicesActions;
};

export type NewAppointmentScreenState = {
  toast: Maybe<Object>;
  isRecurring: boolean;
  recurringPickerOpen: boolean;
  selectedAddons: Service[];
  selectedRequired: Service[] | Maybe<Service>;
  selectedRecommended: Service[];
  clientEmail: string;
  clientPhone: string;
  isValidEmail: boolean;
  isValidPhone: boolean;
  clientPhoneType: ClientPhoneType;
};

export type ServiceItem = {
  itemId: string;
  parentId?: string;
  type?: string;
  guestId?: string;
  hasSelectedRoom?: boolean;
  hasSelectedResource?: boolean;
  service: {
    service: Service;
    employee: PureProvider;
    length: moment.Duration;
    fromTime: moment.Moment;
    toTime: moment.Moment;
    bookBetween: boolean;
    gapTime: moment.Duration;
    afterTime: moment.Duration;
    room: Maybe<Room>;
    roomOrdinal: Maybe<number>;
    resource: Maybe<StoreResource>;
    resourceOrdinal: Maybe<number>;
  };
};
