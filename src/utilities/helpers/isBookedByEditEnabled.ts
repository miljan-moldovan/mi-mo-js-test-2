import { isNull } from 'lodash';
import { AppStore } from '@/models';
import { Settings } from '../apiWrapper';

export async function isBookedByEditEnabled(state: AppStore) {
  const {
    userInfoReducer: { currentEmployee },
    newAppointmentReducer: { isBookingQuickAppt, editType },
  } = state;
  const forceReceptionistUser = await Settings.getSettingsByName(
    'ForceReceptionistUser',
  );
  let isBookedByFieldEnabled = !forceReceptionistUser.settingValue;
  if (isNull(currentEmployee) && (isBookingQuickAppt || editType === 'new')) {
    isBookedByFieldEnabled = true;
  }
  return isBookedByFieldEnabled;
}