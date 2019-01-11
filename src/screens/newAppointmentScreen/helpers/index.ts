import { ServiceItem, RoomType } from '@/models';

export function shouldSelectRoom(itm: ServiceItem) {
  if (!itm.service.service || itm.service.room || itm.hasSelectedRoom) {
    return false;
  }
  if (
    !(
      itm.service.service.requireRoom === RoomType.NULL ||
      itm.service.service.requireRoom === RoomType.Nothing ||
      !itm.service.service.supportedRooms ||
      !itm.service.service.supportedRooms.length
    )
  ) {
    const { supportedRooms } = itm.service.service;
    if (supportedRooms && supportedRooms.length) {
      return itm.service.room ? false : true;
    }
  }
  return false;
}

export function shouldSelectResource(itm: ServiceItem) {
  if (!itm.service.service || itm.service.room || itm.hasSelectedResource) {
    return false;
  }
  if (itm.service.service.requireResource) {
    const { supportedRooms } = itm.service.service;
    if (supportedRooms && supportedRooms.length) {
      return itm.service.room ? false : true;
    }
  }
  return false;
}
