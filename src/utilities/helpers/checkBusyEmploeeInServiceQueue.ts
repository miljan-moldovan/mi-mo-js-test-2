import { uniq } from 'lodash';

import Status from '../../constants/Status';

const checkBusyEmploeeInServiceQueue = (item, manualAssignFA, serviceQueue) => {
  const allEmployeeIdFromItem = [];
  const employeeWhoBusy = [];
  item.services.forEach((itm) => {
    if (itm.employee && itm.employee.id) {
      // protected code if AutoAssignFirstAvailableProvider is true
      allEmployeeIdFromItem.push(itm.employee.id);
    }
  });
  // manualAssignFA.serviceProvider.forEach((itm) => {
  //   if (itm && itm.employeeId) {
  //     allEmployeeIdFromItem.push(itm.employeeId);
  //   }
  // });
  serviceQueue.forEach((servicedItm) => {
    if (servicedItm.status !== Status.finished && servicedItm.status !== Status.checkedOut) {
      const currentItm = {
        id: servicedItm.id,
        clientName: servicedItm.client.fullName,
        providersNames: [],
      };
      allEmployeeIdFromItem.forEach((emploerId) => {
        servicedItm.services.forEach((service) => {
          if (service.employee && service.employee.id === emploerId) {
            currentItm.providersNames.push(service.employee.fullName);
          }
        });
      });
      if (currentItm.providersNames.length) {
        employeeWhoBusy.push(currentItm);
      }
    }
  });

  if (employeeWhoBusy.length) {
    let clinetsName = employeeWhoBusy.map(itm => itm.clientName);
    clinetsName = uniq(clinetsName);

    let emploeeName = [];
    employeeWhoBusy.forEach(itm => emploeeName.push(...itm.providersNames));
    emploeeName = uniq(emploeeName);

    const fewEmploee = emploeeName.length > 1;
    const fewClinets = clinetsName.length > 1;
    const txt = `The service ${fewEmploee ? 'providers' : 'provider'} ${emploeeName.join(', ')} ${fewEmploee ? 'are' : 'is'} currently servicing ${clinetsName.join(', ')}.
    \n Would you like to mark ${fewEmploee || fewClinets ? 'those services' : 'this service'} as finished? `;

    const itemsId = employeeWhoBusy.map(itm => itm.id);

    return {
      title: `Finish ${fewEmploee || fewClinets ? 'Services' : 'Service'}?`,
      text: txt,
      buttonOkText: `Finish ${fewEmploee || fewClinets ? 'Services' : 'Service'}`,
      itemsId,
    };
  }
  // dispatch(setItemToMoveInServiceQueue(null, {busyEmployeeNeedCheck: false}));
  // dispatch(moveToServiceStateMachines(StateQueueItem.Run));
  return null;
};

export default checkBusyEmploeeInServiceQueue;
