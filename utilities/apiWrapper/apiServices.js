import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import queueStatus from './apiServicesResources/queueStatus';
import cookie from './apiServicesResources/cookie';
import settings from './apiServicesResources/settings';
import note from './apiServicesResources/note';
import services from './apiServicesResources/services';
import employees from './apiServicesResources/employees';

const conf = {
  ...queue.resources,
  ...client.resources,
  ...appointment.resources,
  ...queueStatus.resources,
  ...cookie.resources,
  ...settings.resources,
  ...note.resources,
  ...services.resources,
  ...employees.resources,
};

export default {
  conf,
};
