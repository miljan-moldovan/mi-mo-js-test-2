import moment from 'moment';
import { ApptBookReducer } from '@/redux/reducers/appointmentBook';
import { NewAppointmentReducer } from '@/redux/reducers/newAppointment';
import { SettingsReducer } from '@/redux/reducers/settings';
import { FormulasAndNotesReducer } from '@/redux/reducers/formulasAndNotes';
import { NavigationScreenProp } from 'react-navigation';
import { Service, PureProvider } from '../common';
import { Maybe } from '../core';
import { NewApptActions } from '@/redux/actions/newAppointment';

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
  apptBookState: ApptBookReducer;
  settingState: SettingsReducer;
  formulasAndNotesState: FormulasAndNotesReducer;
  getEndTime: moment.Moment;
  totalPrice: number;
  appointmentLength: moment.Duration;
  isValidAppointment: boolean;
  appointmentScreenState: ApptBookReducer;
};

export type NewAppointmentScreenState = {
  toast: Maybe<Object>;
};

export type ServiceItem = {
  itemId: string;
  parentId?: string;
  type?: string;
  guestId?: string;
  service: {
    service: Service;
    employee: PureProvider;
    length: moment.Duration;
    fromTime: moment.Moment;
    toTime: moment.Moment;
    bookBetween: boolean;
    gapTime: moment.Duration;
    afterTime: moment.Duration;
  };
};
