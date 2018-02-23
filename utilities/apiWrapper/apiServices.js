import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
};

export default {
  conf,
};
