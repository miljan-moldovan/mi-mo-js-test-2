export interface ResizeAppointmentRequest {
  appointmentId: number;
  params: {
    newLength: number;
    oldDuration: number;
  };
}
