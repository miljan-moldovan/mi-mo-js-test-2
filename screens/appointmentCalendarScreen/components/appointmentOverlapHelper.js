import { filter } from 'lodash';
import moment from 'moment';

import DateTime from '../../../constants/DateTime';

function checkAppointmentBefore(appointments, index, sourceAppointment) {
  let filteredAppt = [];

  if (appointments[index] &&
    moment(sourceAppointment.fromTime, DateTime.timeOld).isBetween(moment(appointments[index].fromTime, DateTime.timeOld), moment(appointments[index].toTime, DateTime.timeOld), 'minute')) {
    filteredAppt.push(appointments[index]);
    if (index > 0) {
      filteredAppt = filteredAppt
        .concat(checkAppointmentBefore(appointments, index - 1, appointments[index]));
    }
  }

  return filteredAppt;
}

function checkAppointmentAfter(appointments, index, sourceAppointment) {
  let filteredAppt = [];

  if (appointments[index] &&
    moment(appointments[index].fromTime, DateTime.timeOld).isBetween(moment(sourceAppointment.fromTime, DateTime.timeOld), moment(sourceAppointment.toTime, DateTime.timeOld), 'minute')) {
    filteredAppt.push(appointments[index]);
    if (index < appointments.length - 1) {
      filteredAppt = filteredAppt
        .concat(checkAppointmentAfter(appointments, index + 1, appointments[index]));
    }
  }

  return filteredAppt;
}

const sortAppointmentByStartingTime = (a, b) =>
  moment(a.fromTime, DateTime.timeOld).diff(moment(b.fromTime, DateTime.timeOld));

function appointmentOverlapHelper(appointments = [], blockTimes = [], selectedAppointment) {
  const cards = [...appointments, ...blockTimes];
  const employeesAppointments = filter(cards, item => (
    item.employee.id === selectedAppointment.employee.id
  )).sort(sortAppointmentByStartingTime);
  const selectedAppointmentIndex = employeesAppointments.indexOf(selectedAppointment);
  const crossedAppointmentsBefore = checkAppointmentBefore(
    employeesAppointments,
    selectedAppointmentIndex - 1,
    selectedAppointment,
  );

  const crossedAppointmentAfter = checkAppointmentAfter(
    employeesAppointments,
    selectedAppointmentIndex + 1,
    selectedAppointment,
  );

  return {
    allCrossedAppointments: crossedAppointmentsBefore.concat([selectedAppointment]
      .concat(crossedAppointmentAfter)).sort(sortAppointmentByStartingTime),
    appointmentAfter: crossedAppointmentAfter,
  };
}

export default appointmentOverlapHelper;
