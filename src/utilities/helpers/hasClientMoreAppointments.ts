import moment from 'moment';

export const hasClientMoreAppointments = ({ appointment, appointments, }) => {
  const clientAppts = appointments.filter (
    appt =>
      (appt.client.id === appointment.client.id &&
      moment(appointment.date).isSame(moment(appointment.date, 'YYYY-MM-DD'))) && appt.id !== appointment.id && (
        appt.primaryAppointmentId !== appointment.id || !appt.service.isAddon || appt.duration === 0
      )
  );

  return clientAppts || [];
}
