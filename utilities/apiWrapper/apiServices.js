import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import cookie from './apiServicesResources/cookie';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...cookie.resources,
};

export default {
  conf,
};
