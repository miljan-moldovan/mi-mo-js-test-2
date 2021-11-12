import { Maybe } from '@/models';

export type SettingItem<T> = {
  settingName: string;
  settingValue: Maybe<T>;
  id: number;
  dataType: number
};

export type Settings = {
  ApptClientEveryBlock: boolean;
  ApptDisableDragDrop: boolean;
  ApptShowAssistantAssignment: boolean;
  ApptShowRoomAssignment: boolean;
  AutoWalkInServiceId: Maybe<number>;
  TrackRequest: boolean;
  PrintToTicket: Maybe<string>;
  DefaultFormulaType: Maybe<string>;
  AllowOtherQueueRemovalReason: boolean;
  UseFullClientFormApptQueue: boolean;
  ForceAgeInput: boolean;
  ForceAdultBirthday: boolean;
  ForceChildBirthday: boolean;
  TrackClientAge: boolean;
  RequireClientGender: boolean;
  TrackQueueRemoval: boolean;
  MaxChildAge: Maybe<number>;
  MaxAdultAge: Maybe<number>;
  ApptBookWidth: number;
  WalkInMode: number;
  TimeBlockSize: number;
  CountRooms: number;
  ApptBookSales: number;
  ApptBookProductivity: boolean;
  UseFirstAvailable: boolean;
  ForceReceptionistUser: boolean;
  ClearReceptionistOnLogout: boolean;
  ClientSearchType: ClientSearchType;
  EnableAppointmentRestrictions: boolean;
  AppointmentRestrictionsDays: Maybe<number>;
  EnableInlineApptForm: boolean;
  AllowCashedOutApptModify: boolean;
  ForceMissingQueueEmail: boolean;
  AutoAssignFirstAvailableProvider: boolean;
  KeepServiceRebook: boolean;
  UpwardsPriceChanges: boolean;
  ShowOnlyClockedInEmployeesInClientQueue: boolean;
  CompactQueueTickets: boolean;
  CompactSameDayTickets: boolean;
  ReceiptClientQueueTypeID: ReceiptClientQueueTypeForPrint;
  FormulasToPrint: Maybe<string>;
  NotesToPrint: Maybe<string>;
  PreventActivity: boolean;
  ApptCardType: ReceiptTypes;
  AllowServiceProviderToPerformServicesOnMultipleClientsSimultaneously: boolean;
  ApptBookFont: ApptBookFontSize;
};

export enum ReceiptClientQueueTypeForPrint {
  Off = 0,
  Waiting = 1,
  Servicing = 2,
}

export enum WalkInModes {
  Anything = 1,
  RetailOnly = 2,
  Disabled = 3
}

export enum SettingsType {
  String = 1,
  Text = 2,
  Int = 3,
  Decimal = 4,
  Money = 5,
  Bool = 6
}

export enum ClientSearchType {
  ThisStoreFirst = 1,
  AllStores = 2,
  OnlyThisStore = 3
}

export enum ReceiptTypes {
  Never = 0,
  Ask = 1,
  Always = 2
}

export enum ApptBookFontSize {
  Small = 0,
  Medium = 1,
  Large = 2
}

export const apptBookFontSizeMap = {
  [ApptBookFontSize.Small]: {
    heightRow: 21,
    fontSize: 10,
    topLineHeight: 0
  },
  [ApptBookFontSize.Medium]: {
    heightRow: 24,
    fontSize: 11,
    topLineHeight: 2
  },
  [ApptBookFontSize.Large]: {
    heightRow: 30,
    fontSize: 12,
    topLineHeight: 3
  }
};

export type SettingParams<T extends keyof Settings> = {
  value: Settings[T];
  dataType: SettingsType;
  machineSpecific?: boolean;
};

export type SettingUpdater = <T extends keyof Settings>(settingName: T, data: SettingParams<T>) => void;
