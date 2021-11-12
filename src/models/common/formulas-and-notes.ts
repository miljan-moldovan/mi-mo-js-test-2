export interface FormulaType {
  id: number;
  name: string;
}

export enum FormulaEnum {
  Color = 0,
  Perm = 1,
  Skin = 2,
  Nail = 3,
  Massage = 4,
  Hair = 5,
  NULL = -1
}

export interface Formula {
  date: string;
  formulaType: FormulaEnum;
  id: number;
  iAmNew?: number;
  stylistName: string;
  service: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  store: {
    id: 1;
    name: number;
    isDeleted: boolean;
    updateStamp: number;
  };
  isDeleted: boolean;
  text: string;
}

export interface NoteType {
  id: string;
  name: string;
}

export interface Note {
  id?: number;
  iAmNew?: number;
  expiration: string;
  isDeleted: boolean;
  text: string;
  forAppointment: boolean;
  forQueue: boolean;
  forSales: boolean;
  updatedBy: string;
  enteredBy: string;
  enterTime: string;
  updateTime: string;
  updateStamp: number;
}

export interface FormulaAndNotes {
  client: {
    id: number;
  };
  formulas: Formula[];
  notes: Note[];
}
