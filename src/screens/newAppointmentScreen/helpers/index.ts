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
      if (itm.service.room !== null && itm.service.resource !== undefined) {
        return itm.service.room.id === null;
      }
      return true;
    }
  }
  return false;
}

export function shouldSelectResource(itm: ServiceItem) {
  if (!itm.service.service || itm.service.resource || itm.hasSelectedResource) {
    return false;
  }
  if (itm.service.service.requireResource) {
    const { supportedResource } = itm.service.service;
    if (supportedResource) {
      if (itm.service.resource !== null && itm.service.resource !== undefined) {
        return itm.service.resource.id === null;
      }
      return true;
    }
  }
  return false;
}
