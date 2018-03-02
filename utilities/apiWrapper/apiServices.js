import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import queueStatus from './apiServicesResources/queueStatus';
import cookie from './apiServicesResources/cookie';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...queueStatus.resources,
  ...cookie.resources,
};

export default {
  conf,
};
