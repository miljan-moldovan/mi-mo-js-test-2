import {
  ProductEmployeeClientQueues,
  ServiceQueue,
  MoveAppointmentModalState,
  ShortClient,
  CurrentProvider,
  ErrorApiResponse,
  WalkOutReasons,
  WalkInService,
  AppointmentConflictModalState,
  ClientInfoState,
  CancelAppointmentModalState,
  ResizeAppointmentModalState,
  FutureAppointmentsListModalState,
  CancelBlockTimeModalState,
  AppointmentNotesModalState,
  AppointmentRemindersModal,
  AppointmentBlockTime,
  RoomAssignmentModal,
  DataMessageClientsModal,
  RejectAppointmentModalState,
  AcceptAppointmentModalState
} from '@/models';

import { Tasks } from '@app-constants/core';

export interface LoginForm {
  isOpen: boolean;
  data: LoginFormData;
}

export interface MessageClientsModal {
  isOpen: boolean;
  data: DataMessageClientsModal;
}

export interface LoginFormData {
  preFillUser: boolean;
  taskName: Tasks;
  actionName?: string;
  actionParams?: any[];
}

export interface ClientEmail {
  isOpen: boolean;
  client: {
    id: number | null;
    name: string;
  };
}
export interface Confirmation {
  headerText?: string;
  text: string;
  buttonOkText?: string;
  buttonCancelText?: string;
  decline(): void;
  confirm(): void;
}

export interface DataNotificationModal {
  title?: string;
  msg: string | (string | JSX.Element)[];
  forbidClosing?: boolean;
}

export interface NotificationModal {
  isOpen: boolean;
  data: DataNotificationModal;
}

export interface ModalsState {
  isOpenModal: boolean;
  uncombineConfirm: {
    isOpenUncombineConfirm: boolean;
    grupId: number;
  };
  selectServiceProvider: {
    isOpenSelectServiceProvider: boolean;
    payload: {
      id: number;
      services: ServiceQueue[];
      products?: ProductEmployeeClientQueues[];
    }
  };
  loginForm: LoginForm;
  isOpenWalkIn: boolean;
  isOpenModifyModal: boolean;
  isModifyModalSubmitting: boolean;
  isOpenWalkOut: boolean;
  clientEmail: ClientEmail | null;
  isOpenWalkOutConfirm: boolean;
  isOpenMergeDuplicateClients: boolean;
  isActiveWalkOut: boolean;
  moveAppointmentModal: MoveAppointmentModalState;
  client: ShortClient;
  providerForSend: CurrentProvider;
  error: ErrorApiResponse | null;
  walkInSuccess: boolean;
  walkOutReasons: WalkOutReasons[];
  loadingWalkOutReasons: boolean;
  loading: boolean;
  walkInServices: WalkInService[];
  appointmentConflictModal: AppointmentConflictModalState;
  futureAppointmentsListModal: FutureAppointmentsListModalState;
  appointmentResizeModal: ResizeAppointmentModalState;
  blockTimeResizeModal: ResizeAppointmentModalState;
  cancelAppointmentModal: CancelAppointmentModalState;
  rejectAppointmentModal: RejectAppointmentModalState;
  acceptAppointmentModal: AcceptAppointmentModalState;
  cancelBlockTimeModal: CancelBlockTimeModalState;
  appointmentNotesModal: AppointmentNotesModalState;
  clientInfoModal: ClientInfoState;
  appointmentRemindersModal: AppointmentRemindersModal;
  appointmentBlockTime: AppointmentBlockTime;
  roomAssignmentModal: RoomAssignmentModal;
  messageClientsModal: MessageClientsModal;
  notificationModal: NotificationModal;
}
