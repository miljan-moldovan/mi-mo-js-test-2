export const getHiddenAddons = (appointments, appointment) => appointments.filter(appt =>
  appt.primaryAppointmentId === appointment.id
    && appt.service.isAddon && appt.duration === 0);

export default getHiddenAddons;
