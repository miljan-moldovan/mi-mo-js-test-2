import queue from './apiServicesResources/queue';
import client from './apiServicesResources/client';
import appointment from './apiServicesResources/appointment';
import queueStatus from './apiServicesResources/queueStatus';
import cookie from './apiServicesResources/cookie';
import settings from './apiServicesResources/settings';
import note from './apiServicesResources/note';
import services from './apiServicesResources/services';
import employees from './apiServicesResources/employees';
import product from './apiServicesResources/product';
import salon from './apiServicesResources/salon';
import turnAway from './apiServicesResources/turnAway';
import appointmentBook from './apiServicesResources/appointmentBook';
import store from './apiServicesResources/store';

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
  ...product.resources,
  ...salon.resources,
  ...turnAway.resources,
  ...appointmentBook.resources,
  ...store.resources,
};

export default {
  conf,
};
