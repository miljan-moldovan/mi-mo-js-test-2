import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import queueStatus from './apiServicesResources/queueStatus';
import cookie from './apiServicesResources/cookie';
import note from './apiServicesResources/note';
import services from './apiServicesResources/services';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...queueStatus.resources,
  ...cookie.resources,
  ...note.resources,
  ...services.resources,
};

export default {
  conf,
};
