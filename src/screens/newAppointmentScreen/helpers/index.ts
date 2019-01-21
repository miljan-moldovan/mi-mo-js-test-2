import { get } from 'lodash';
import { ServiceItem } from '@/models';

export function shouldSelectRoom(itm: ServiceItem) {
  if (!itm.service.service || itm.service.room) {
    return false;
  }
  if (itm.service.service.requireRoom && itm.service.service.requireRoom >= 1) {
    const { supportedRooms } = itm.service.service;
    if (supportedRooms && supportedRooms.length) {
      if (itm.service.room !== null && itm.service.resource !== undefined) {
        return get(itm.service.room, 'id') === null;
      }
      return true;
    }
  }
  return false;
}

export function shouldSelectResource(itm: ServiceItem) {
  if (!itm.service.service || itm.service.resource) {
    return false;
  }
  if (itm.service.service.requireResource) {
    const { supportedResource } = itm.service.service;
    if (supportedResource) {
      if (itm.service.resource !== null && itm.service.resource !== undefined) {
        return get(itm.service.resource, 'id') === null;
      }
      return true;
    }
  }
  return false;
}
