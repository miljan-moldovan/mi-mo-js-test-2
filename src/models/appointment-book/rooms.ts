import { Maybe } from '@/models';

export interface Room {
  roomCount: number;
  name: string;
  id: number;
}

export interface RoomFromApi {
  date: string;
  fromTime: string;
  roomId: Maybe<number>;
  roomOrdinal: Maybe<number>;
  toTime: string;
}

export interface RoomAppointment {
  room: Room;
  roomOrdinal: number;
  appointmentId: number;
}
