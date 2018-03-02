import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import queueStatus from './apiServicesResources/queueStatus';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...queueStatus.resources,
};

export default {
  conf,
};
