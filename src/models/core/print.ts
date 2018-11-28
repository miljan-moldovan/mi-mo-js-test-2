import { Client, PastService, RetailHistoryItem, Note, Service, QueueItem, Formula, ClientAppointment } from '@/models';

export enum PrintOutletName {
  ClientWorkTicket = 'ClientWorkTicket',
  CompactClientWorkTicket = 'CompactClientWorkTicket',
  WorkTicketAndCardTicket = 'WorkTicketAndCardTicket',
  CompactWorkTicketAndCardTicket = 'CompactWorkTicketAndCardTicket',
  CardTicket = 'CardTicket',
  ClientAppointmentList = 'ClientAppointmentList',
  FormulaOfClient = 'FormulaOfClient',
}

export interface PrintOutlet {
  name: PrintOutletName;
  data: any;
}

export interface ClientWorkTicketData {
  client: Client;
  appointmentsToday: ClientAppointment[];
  pastServices: PastService[];
  retailHistory: RetailHistoryItem[];
  notes: Note[];
  upcomingAppointments: ClientAppointment[];
  services: Service[];
  formulas?: Formula[];
  appointmentDate: string;
  appointmentId: number;
  providerFullName: string;
}

export interface ClientWorkTicketDataQueue {
  queueItm: QueueItem;
  client: Client;
  pastServices: PastService[];
  retailHistory: RetailHistoryItem[];
  notes: Note[];
  upcomingAppointments: ClientAppointment[];
  services: Service[];
  appointmentDate: string;
  appointmentId: number;
  providerFullName: string;
  appointmentsToday: ClientAppointment[];
}

export interface WorkTicketRequest {
  clientId: number;
  employeeId: number;
  appointmentId: number;
  date: string;
}

export interface FormulaOfClientData {
  text: string;
  clientName: string;
}
