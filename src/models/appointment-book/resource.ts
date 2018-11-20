export interface ResourceAppointment {
  appointmentId: number;
  resource: Resource;
  resourceOrdinal: number;
}

export interface Resource {
  id: number;
  name: string;
  resourceCount: number;
}
