import {isFunction} from 'lodash';
import {
  QueueStatus,
  Queue,
  Employees,
  Services,
} from '../../utilities/apiWrapper';
import {showErrorAlert, executeAllPromises} from './utils';
import { string } from 'prop-types';

export const QUEUE = 'queue/QUEUE';
export const QUEUE_RECEIVED = 'queue/QUEUE_RECEIVED';
export const QUEUE_FAILED = 'queue/QUEUE_FAILED';
export const QUEUE_DELETE_ITEM = 'queue/QUEUE_DELETE_ITEM';
export const QUEUE_UPDATE_ITEM = 'queue/QUEUE_UPDATE_ITEM';
export const CLIENT_CHECKED_IN = 'queue/CLIENT_CHECKED_IN';
export const CLIENT_CHECKED_IN_FAILED = 'queue/CLIENT_CHECKED_IN_FAILED';
export const CLIENT_CHECKED_IN_RECEIVED = 'queue/CLIENT_CHECKED_IN_RECEIVED';
export const CLIENT_UNCHECKED_IN = 'queue/CLIENT_UNCHECKED_IN';
export const CLIENT_UNCHECKED_IN_FAILED = 'queue/CLIENT_UNCHECKED_IN_FAILED';
export const CLIENT_UNCHECKED_IN_RECEIVED =
  'queue/CLIENT_UNCHECKED_IN_RECEIVED';
export const CLIENT_NO_SHOW = 'queue/CLIENT_NO_SHOW';
export const CLIENT_NO_SHOW_RECEIVED = 'queue/CLIENT_NO_SHOW_RECEIVED';
export const CLIENT_NO_SHOW_FAILED = 'queue/CLIENT_NO_SHOW_FAILED';
export const CLIENT_RETURNED_LATER = 'queue/CLIENT_RETURNED_LATER';
export const CLIENT_RETURNED_LATER_FAILED =
  'queue/CLIENT_RETURNED_LATER_FAILED';
export const CLIENT_RETURNED_LATER_RECEIVED =
  'queue/CLIENT_RETURNED_LATER_RECEIVED';
export const CLIENT_RETURNED = 'queue/CLIENT_RETURNED';
export const CLIENT_RETURNED_RECEIVED = 'queue/CLIENT_RETURNED_RECEIVED';
export const CLIENT_RETURNED_FAILED = 'queue/CLIENT_RETURNED_FAILED';
export const CLIENT_WALKED_OUT = 'queue/CLIENT_WALKED_OUT';
export const CLIENT_WALKED_OUT_RECEIVED = 'queue/CLIENT_WALKED_OUT_RECEIVED';
export const CLIENT_WALKED_OUT_FAILED = 'queue/CLIENT_WALKED_OUT_FAILED';
export const CLIENT_START_SERVICE = 'queue/CLIENT_START_SERVICE';
export const CLIENT_START_SERVICE_FAILED = 'queue/CLIENT_START_SERVICE_FAILED';
export const CLIENT_START_SERVICE_RECEIVED =
  'queue/CLIENT_START_SERVICE_RECEIVED';
export const CLIENT_FINISH_SERVICE = 'queue/CLIENT_FINISH_SERVICE';
export const CLIENT_FINISH_SERVICE_FAILED =
  'queue/CLIENT_FINISH_SERVICE_FAILED';
export const CLIENT_FINISH_SERVICE_RECEIVED =
  'queue/CLIENT_FINISH_SERVICE_RECEIVED';
export const CLIENT_UNDOFINISH_SERVICE = 'queue/CLIENT_UNDOFINISH_SERVICE';
export const CLIENT_UNDOFINISH_SERVICE_FAILED =
  'queue/CLIENT_UNDOFINISH_SERVICE_FAILED';
export const CLIENT_UNDOFINISH_SERVICE_RECEIVED =
  'queue/CLIENT_UNDOFINISH_SERVICE_RECEIVED';
export const CLIENT_CHECKOUT = 'queue/CLIENT_CHECKOUT';
export const CLIENT_CHECKOUT_FAILED = 'queue/CLIENT_CHECKOUT_FAILED';
export const CLIENT_CHECKOUT_RECEIVED = 'queue/CLIENT_CHECKOUT_RECEIVED';
export const CLIENT_TO_WAITING = 'queue/CLIENT_TO_WAITING';
export const CLIENT_TO_WAITING_RECEIVED = 'queue/CLIENT_TO_WAITING_RECEIVED';
export const CLIENT_TO_WAITING_FAILED = 'queue/CLIENT_TO_WAITING_FAILED';
export const TIME_UPDATE = 'queue/TIME_UPDATE';
export const ROW_EXPANDED = 'queue/ROW_EXPANDED';
export const START_COMBINE = 'queue/START_COMBINE';
export const CANCEL_COMBINE = 'queue/CANCEL_COMBINE';
export const FINISH_COMBINE = 'queue/FINISH_COMBINE';
export const COMBINE_CLIENT = 'queue/COMBINE_CLIENT';
export const GROUP_LEAD_UPDATE = 'queue/GROUP_LEAD_UPDATE';
export const UNCOMBINE = 'queue/UNCOMBINE';
export const UPDATE_GROUPS = 'queue/UPDATE_GROUPS';
export const PUT_QUEUE = 'queue/PUT_QUEUE';
export const PUT_QUEUE_SUCCESS = 'queue/PUT_QUEUE_SUCCESS';
export const PUT_QUEUE_FAILED = 'queue/PUT_QUEUE_FAILED';
export const GET_QUEUE_STATE = 'queue/GET_QUEUE_STATE';
export const GET_QUEUE_STATE_SUCCESS = 'queue/GET_QUEUE_STATE_SUCCESS';
export const GET_QUEUE_STATE_FAILED = 'queue/GET_QUEUE_STATE_FAILED';
export const SET_LOADING = 'queue/SET_LOADING';

export const GET_QUEUE_ITEM_PROVIDER_STATUS =
  'queue/GET_QUEUE_ITEM_PROVIDER_STATUS';
export const GET_QUEUE_ITEM_PROVIDER_STATUS_SUCCESS =
  'queue/GET_QUEUE_ITEM_PROVIDER_STATUS_SUCCESS';
export const GET_QUEUE_ITEM_PROVIDER_STATUS_FAILED =
  'queue/GET_QUEUE_ITEM_PROVIDER_STATUS_FAILED';


export const setLoading = (loading: boolean): any  => ({
  type: SET_LOADING,
  data: {loading},
});

const startServiceSuccess = (data: any): any  => ({
  type: CLIENT_START_SERVICE_RECEIVED,
  data: {data},
});

const startServiceFailed = (error: any): any  => ({
  type: CLIENT_START_SERVICE_FAILED,
  data: {error},
});

export const startService = (id:number, serviceData:any, callback?: (...args: any) => any)  => dispatch => {
  dispatch ({type: CLIENT_START_SERVICE, data: {id}});

  return QueueStatus.putStartService (id, serviceData)
    .then (resp => {
      dispatch (startServiceSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (startServiceFailed (error));
      callback (false, error);
    });
};

const getQueueItemProviderStatusSuccess = (response: any): any  => ({
  type: GET_QUEUE_ITEM_PROVIDER_STATUS_SUCCESS,
  data: {response},
});

const getQueueItemProviderStatusFailed =  (error: any): any  => ({
  type: GET_QUEUE_ITEM_PROVIDER_STATUS_FAILED,
  data: {error},
});

export const getQueueItemProviderStatus = (queueItem: any, callback?: (...args: any) => any): any  => dispatch => {
  const promises = [];

  for (let i = 0; i < queueItem.services.length; i += 1) {
    if (!queueItem.services[i].isFirstAvailable) {
      promises.push (
        executeAllPromises ([
          Services.getServiceEmployeeCheck ({
            serviceId: queueItem.services[i].serviceId,
            employeeId: queueItem.services[i].employee.id,
            setCancelToken: false,
          }),
          Employees.getEmployeeStatus (
            queueItem.services[i].employee.id,
            false
          ),
          Promise.resolve (queueItem.services[i]),
        ])
      );
    }
  }

  return executeAllPromises (promises)
    .then (promises => {
      const {results} = promises;
      const messages = [];
      const servicesWithEmployeeNotStarted = [];

      for (let i = 0; i < results.length; i += 1) {
        const employeeDoesService = results[i].results[0] !== undefined;
        const employeeStatus = results[i].results[1];
        const service = results[i].results[2];
        const {isWorking} = employeeStatus;
        if (!isWorking) {
          servicesWithEmployeeNotStarted.push(service.employee.fullName);
        }
        if (!employeeDoesService) {
          const employeeNamesString = service.employee.fullName;
          const serviceNameString = service.serviceName;

          const msg = `${employeeNamesString} doesn't perform the service '${serviceNameString}'`;

          messages.push (msg);
        }
      }

      if (servicesWithEmployeeNotStarted.length > 0) {
        const coupleEmpl = servicesWithEmployeeNotStarted.length > 1;
        const employeeNamesArray = Array.from(new Set(servicesWithEmployeeNotStarted)) ;
        const employeeNamesString = employeeNamesArray.join (', ');
        const msg = `${employeeNamesString} ${coupleEmpl ? 'are' : 'is'} currently not working,
      please punch in ${employeeNamesString} in order to start ${coupleEmpl ? 'these services' : 'this service'}.`;

        messages.push (msg);
      }

      return messages;
    })
    .catch (ex => false);
};

const receiveQueueSuccess = (resp: any): any  => ({
  type: QUEUE_RECEIVED,
  data: {resp},
});

const receiveQueueFailed =  (error: any): any  => ({
  type: QUEUE_FAILED,
  data: {error},
});

export const receiveQueue = (callback?: (...args: any) => any, showError: boolean = false): any  => dispatch => {
  dispatch ({type: QUEUE});

  return Queue.getQueue ()
    .then (resp => {
      dispatch (receiveQueueSuccess (resp));
      callback (true);
    })
    .catch (error => {
      if (showError) {
        showErrorAlert (error);
      }
      dispatch (receiveQueueFailed (error));
      callback (false, error);
    });
};

export const deleteQueueItem = (id: number): any  => {
  return {
    type: QUEUE_DELETE_ITEM,
    data: {id},
  };
}
export const saveQueueItem = (queueItem: any): any  => {
  return {
    type: QUEUE_UPDATE_ITEM,
    data: {queueItem},
  };
}

const checkInClientSuccess = (data: any): any  => ({
  type: CLIENT_CHECKED_IN_RECEIVED,
  data: {data},
});

const checkInClientFailed =  (error: any): any  => ({
  type: CLIENT_CHECKED_IN_FAILED,
  data: {error},
});

export const checkInClient = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_CHECKED_IN, data: {id}});
  return QueueStatus.putCheckIn (id)
    .then (resp => {
      dispatch (checkInClientSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (checkInClientFailed (error));
      callback (false, error);
    });
};

const uncheckInClientSuccess = (data: any): any  => ({
  type: CLIENT_UNCHECKED_IN_RECEIVED,
  data: {data},
});

const uncheckInClientFailed =  (error: any): any  => ({
  type: CLIENT_UNCHECKED_IN_FAILED,
  data: {error},
});

export const uncheckInClient = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_UNCHECKED_IN, data: {id}});
  return QueueStatus.putUncheckIn (id)
    .then (resp => {
      dispatch (uncheckInClientSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (uncheckInClientFailed (error));
      callback (false, error);
    });
};
  
const returnLaterSuccess = (data: any): any  => ({
  type: CLIENT_RETURNED_LATER_RECEIVED,
  data: {data},
});

const returnLaterFailed =  (error: any): any  => ({
  type: CLIENT_RETURNED_LATER_FAILED,
  data: {error},
});

export const returnLater = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_RETURNED_LATER, data: {id}});
  return QueueStatus.putReturnLater (id)
    .then (resp => {
      dispatch (returnLaterSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (returnLaterFailed (error));
      callback (false, error);
    });
};

const returnedSuccess = (data: any): any  => ({
  type: CLIENT_RETURNED_RECEIVED,
  data: {data},
});

const returnedFailed =  (error: any): any  => ({
  type: CLIENT_RETURNED_FAILED,
  data: {error},
});

export const returned = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_RETURNED, data: {id}});
  return QueueStatus.putReturned (id)
    .then (resp => {
      dispatch (returnedSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (returnedFailed (error));
      callback (false, error);
    });
};

const walkOutSuccess = (data: boolean): any  => ({
  type: CLIENT_WALKED_OUT_RECEIVED,
  data: {data},
});

const walkOutFailed =  (error: any): any  => ({
  type: CLIENT_WALKED_OUT_FAILED,
  data: {error},
});

export const walkOut = (id: number, params:[], callback?: (...args: any) => any): any  => dispatch => {

  dispatch ({type: CLIENT_WALKED_OUT, data: {id}});
  return QueueStatus.putWalkOut (id, params)
    .then (resp => {
      dispatch (walkOutSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (walkOutFailed (error));
      callback (false, error);
    });
};

const noShowSuccess = (data: any): any  => ({
  type: CLIENT_NO_SHOW_RECEIVED,
  data: {data},
});

const noShowFailed =  (error: any): any  => ({
  type: CLIENT_NO_SHOW_FAILED,
  data: {error},
});

export const noShow = (id: number, params:[], callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_NO_SHOW, data: {id}}); 
  return QueueStatus.putNoShow (id, params)
    .then (resp => {
      dispatch (noShowSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (noShowFailed (error));
      callback (false, error);
    });
};
 
const finishServiceSuccess = (data: any): any  => ({
  type: CLIENT_FINISH_SERVICE_RECEIVED,
  data: {data},
});

const finishServiceFailed =  (error: any): any  => ({
  type: CLIENT_FINISH_SERVICE_FAILED,
  data: {error},
});

export const finishService = (ids: any, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_FINISH_SERVICE, data: {ids}});
  const promisees = [];
  ids.forEach (id => promisees.push (QueueStatus.putFinish (id)));
  return Promise.all (promisees)
    .then (resp => {
      if (callback) {
        callback (true);
      }
      return dispatch (finishServiceSuccess (resp));
    })
    .catch (error => {
      showErrorAlert (error);
      if (callback) {
        callback (true);
      }
      return dispatch (finishServiceFailed (error));
    });
};

const undoFinishServiceSuccess = (data: any): any  => ({
  type: CLIENT_UNDOFINISH_SERVICE_RECEIVED,
  data: {data},
});

const undoFinishServiceFailed =  (error: any): any  => ({
  type: CLIENT_UNDOFINISH_SERVICE_FAILED,
  data: {error},
});

export const undoFinishService = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_UNDOFINISH_SERVICE, data: {id}});
  return QueueStatus.putUndoFinish (id)
    .then (resp => {
      dispatch (undoFinishServiceSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (undoFinishServiceFailed (error));
      callback (false, error);
    });
};

const toWaitingSuccess = (data: any): any  => ({
  type: CLIENT_TO_WAITING_RECEIVED,
  data: {data},
});
 
const toWaitingFailed =  (error: any): any  => ({
  type: CLIENT_TO_WAITING_FAILED,
  data: {error},
});

export const toWaiting = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_TO_WAITING, data: {id}});
  return QueueStatus.putToWaiting (id)
    .then (resp => {
      dispatch (toWaitingSuccess (resp));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (toWaitingFailed (error));
      callback (false, error);
    });
};

export const updateTime = (): any  => {
  return {
    type: TIME_UPDATE,
  };
}

export const expandRow = (id: number): any  => {
  return {
    type: ROW_EXPANDED,
    data: {id},
  };
}

export const startCombine = (): any  => {
  return {
    type: START_COMBINE,
  };
}

export const cancelCombine = (): any  => {
  return {
    type: CANCEL_COMBINE,
  };
}

export const finishCombine = (   
  combiningClients: Array<any>,
  callback
) => async function(dispatch) {
  try {
    dispatch ({type: QUEUE});
    const data = {
      clientQueueIdList: [],
      payingClientQueueId: null,
    };
    combiningClients.map (item => {
      data.clientQueueIdList.push (item.id);
      if (item.groupLead) {
        data.payingClientQueueId = item.id;
      }
    });

    const response = await Queue.postQueueGroup (data);

    dispatch (receiveQueue());

    if (isFunction (callback)) {
      callback (true);
    }
  } catch (error) {
    dispatch ({type: QUEUE_FAILED, error});

    if (isFunction (callback)) {
      callback (false);
    }
  }
};
export const updateGroupLeaders = (groups: Object) => async function(dispatch) {
  try {
    dispatch ({type: QUEUE});

    for (const groupId in groups) {
      const clientQueueId = groups[groupId];
      const response = await Queue.putQueueGroupLeader ({
        groupId,
        clientQueueId,
      });
    }

    dispatch (receiveQueue ());
  } catch (error) {
    dispatch ({type: QUEUE_FAILED, error});
  }
};

export const combineClient = (data: any): any  => {
  return {
    type: COMBINE_CLIENT,
    data,
  };
}

export const uncombine = (groupId: number) => async function(dispatch) {
  try {
    dispatch ({type: QUEUE});

    const response = await Queue.deleteQueueGroup (groupId);

    dispatch (receiveQueue ());
  } catch (error) {
    dispatch ({type: QUEUE_FAILED, error});
  }
};

export const updateGroups = (): any  => {
  return {
    type: UPDATE_GROUPS,
  };
}

export const putQueueSuccess = (notes: any): any  => ({
  type: PUT_QUEUE_SUCCESS,
  data: {notes},
});

export const putQueueFailed =  (error: any): any  => ({
  type: PUT_QUEUE_FAILED,
  data: {error},
});

export const putQueue = (queueId: number, queue, callback?: (...args: any) => any): any  => dispatch => {

  callback = callback || (() => {});
  dispatch ({type: PUT_QUEUE});
  return Queue.putQueue (queueId, queue)
    .then (response => {
      dispatch (putQueueSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (putQueueFailed (error));
      callback (false);
    });
};

export const putQueueServiceEmployeeEmployeeSuccess = (notes: any): any  => ({
  type: PUT_QUEUE_SUCCESS,
  data: {notes},
});

export const putQueueServiceEmployeeEmployeeFailed =  (error: any): any  => ({
  type: PUT_QUEUE_FAILED,
  data: {error},
});

export const putQueueServiceEmployeeEmployee = 
  (queueId:number,
    serviceEmployeeId:number,
    queue:any,
    callback?: (...args: any) => any
    ): any  => dispatch =>  {
  callback = callback || (() => {});
  dispatch ({type: PUT_QUEUE});
  return Queue.putQueueServiceEmployeeEmployee (
    queueId,
    serviceEmployeeId,
    queue
  )
    .then (response => {
      dispatch (putQueueServiceEmployeeEmployeeSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (putQueueServiceEmployeeEmployeeFailed (error));
      callback (false);
    });
};

export const putQueueServiceEmployeeServiceSuccess = (notes: any): any  => ({
  type: PUT_QUEUE_SUCCESS,
  data: {notes},
});

export const putQueueServiceEmployeeServiceFailed =  (error: any): any  => ({
  type: PUT_QUEUE_FAILED,
  data: {error},
});

export const putQueueServiceEmployeeService = 
  (queueId:number,
    serviceEmployeeId:number,
    queue:any,
    callback?: (...args: any) => any
    ): any => dispatch =>  {
  callback = callback || (() => {});
  dispatch ({type: PUT_QUEUE});
  return Queue.putQueueServiceEmployeeService (
    queueId,
    serviceEmployeeId,
    queue
  )
    .then (response => {
      dispatch (putQueueServiceEmployeeServiceSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (putQueueServiceEmployeeServiceFailed (error));
      callback (false);
    });
};

export const getQueueStateSuccess = (response: any): any  => ({
  type: GET_QUEUE_STATE_SUCCESS,
  data: {response},
});

export const getQueueStateFailed =  (error: any): any  => ({
  type: GET_QUEUE_STATE_FAILED,
  data: {error},
});

export const getQueueState = (callback?: (...args: any) => any): any  => dispatch => {
  callback = callback || (() => {});
  dispatch ({type: GET_QUEUE_STATE});
  return Queue.getQueueState ()
    .then (response => {
      dispatch (getQueueStateSuccess (response));
      callback (true);
    })
    .catch (error => {
      dispatch (getQueueStateFailed (error));
      callback (false);
    });
};

export const checkOut = (id: number, callback?: (...args: any) => any): any  => dispatch => {
  dispatch ({type: CLIENT_CHECKOUT, data: {id}});
  return QueueStatus.putCheckOut (id)
    .then (res => {
      dispatch ({type: CLIENT_CHECKOUT_RECEIVED, data: {res}});
      if (isFunction (callback)) {
        callback (true);
      }
    })
    .catch (error => {
      showErrorAlert (error);
      if (isFunction (callback)) {
        callback (false);
      }
      dispatch ({type: CLIENT_CHECKOUT_FAILED, data: {error}});
    });
};
