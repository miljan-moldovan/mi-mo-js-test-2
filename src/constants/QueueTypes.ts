const QueueTypes = {
  // <summary> If the ClientQueue is created from an appointment, this value should be used. </summary>
  PosAppointment: 1,
  // <summary> If the ClientQueue is created from inside SU by adding a walk-in, this value should be used. </summary>
  PosWalkIn: 2,
  // <summary> If the ClientQueue is created from the web-interface of bookedby, this value should be used. </summary>
  BookedbyWeb: 3,
  // <summary> If the ClientQueue is created through the self-check-in native app
  // via the bookedby api, this value should be used. </summary>
  BookedbyApp: 4,
  // <summary> If the ClientQueue is created through the in-store self-check-in kiosk, this value should be used. </summary>
  KioskWalkIn: 5,
};

export default QueueTypes;
