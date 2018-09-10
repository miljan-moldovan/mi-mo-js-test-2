import { filter } from 'lodash';

function checkAppointmentBefore(appointments, index, sourceAppointment) {
  let filteredAppt = [];
  if (appointments[index] && appointments[index].toTime > sourceAppointment.fromTime) {
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
  if (appointments[index] && appointments[index].fromTime < sourceAppointment.toTime) {
    filteredAppt.push(appointments[index]);
    if (index < appointments.length - 1) {
      filteredAppt = filteredAppt
        .concat(checkAppointmentAfter(appointments, index + 1, appointments[index]));
    }
  }

  return filteredAppt;
}

const sortAppointmentByStartingTime = (a, b) => a.fromTime > b.fromTime;

function appointmentOverlapHelper(appointments, selectedAppointment) {
  const employeesAppointments = filter(appointments, item => (
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
