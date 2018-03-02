import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import cookie from './apiServicesResources/cookie';
import note from './apiServicesResources/note';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...cookie.resources,
  ...note.resources,
};

export default {
  conf,
};
