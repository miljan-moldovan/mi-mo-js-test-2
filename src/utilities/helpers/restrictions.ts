import { AccessState } from '@/constants/Tasks';
import * as Session from '@/utilities/apiWrapper/apiServicesResources/session';
import { Alert, AlertIOS } from 'react-native';
import { checkPasswordCorrect } from '@/redux/actions/login';
import { SET_RESTRICTION } from '@/redux/actions/restrictions';

export const restrictionsHelper = async (taskType, allowed, dispatch, getState,
                                         allowedWithRelogin = allowedWithReloginDefault,
                                         denied = deniedDefault) => {
  try {
    let taskStatus;
    // not send request if data already exist in store
    // taskStatus = getState().restrictionsReducer[Tasks.Appt_EnterBlock];

    // if (taskStatus === null) {
    taskStatus = await sendRequestSessionTaskIsAllowed(dispatch, taskType);
    // }

    switch (taskStatus) {
      case AccessState.Allowed: {
        return allowed();
      }
      case AccessState.AllowedWithRelogin: {
        return allowedWithRelogin(allowed, dispatch, taskType);

      }
      case AccessState.Denied: {
        return denied();
      }
    }

  } catch (e) {
    dispatch({
      type: SET_RESTRICTION, data: { type: taskType, value: null },
    });
  }
};


const sendRequestSessionTaskIsAllowed = async (dispatch, taskType) => {

  dispatch({
    type: SET_RESTRICTION, data: { type: taskType, value: AccessState.Loading },
  });
  const response = await Session.getSessionTaskIsAllowed(taskType);
  dispatch({
    type: SET_RESTRICTION, data: { type: taskType, value: response },
  });
  return response;
};

const allowedWithReloginDefault = (allowed, dispatch, taskType) => {
  dispatch({
    type: SET_RESTRICTION, data: { type: taskType, value: AccessState.Loading },
  });
  AlertIOS.prompt(
    'Password',
    'Please insert your password',
    [{
      text: 'Cancel',
      onPress: () => dispatchAllowedWithRelogin(dispatch, taskType),
    }, {
      text: 'OK',
      onPress: (password) => {
        return dispatch(checkPasswordCorrect(password, (success) => {
          dispatchAllowedWithRelogin(dispatch, taskType);
          return reLoginCallback(success, allowed);
        }));
      },
    }],
    'secure-text',
  );
};

const dispatchAllowedWithRelogin = (dispatch, taskType) => dispatch({
  type: SET_RESTRICTION, data: { type: taskType, value: AccessState.AllowedWithRelogin },
});

const reLoginCallback = (success, allowed) => {
  if (success) {
    return allowed();
  }
  return Alert.alert('Wrong password');
};

const deniedDefault = () => {
  Alert.alert('You haven\'t accesse to do this action');
};
