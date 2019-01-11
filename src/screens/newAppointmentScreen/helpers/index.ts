import { ServiceItem } from '@/models';

export function shouldSelectRoom(itm: ServiceItem) {
  if (!itm.service.service || itm.service.room) {
    return false;
  }
  if (itm.service.service.requireRoom && itm.service.service.requireRoom >= 1) {
    const { supportedRooms } = itm.service.service;
    if (supportedRooms && supportedRooms.length) {
      return itm.service.room ? false : true;
    }
  }
  return false;
}

export function shouldSelectResource(itm: ServiceItem) {
  if (!itm.service.service || itm.service.room) {
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
