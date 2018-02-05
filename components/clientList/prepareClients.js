import AlphabeticalListItem from './items/alphabeticalListItem';
import PreferredProviderClientListItem from './items/preferredProviderClientListItem';
import LastVisitClientListItem from './items/lastVisitClientListItem';
import UpcomingAppointmentsClientListItem from './items/upcomingAppointmentsClientListItem';
import MembershipClientListItem from './items/membershipClientListItem';

import MembershipHeader from './headers/membershipHeader';
import PreferredProviderHeader from './headers/preferredProviderHeader';
import LastVisitHeader from './headers/lastVisitHeader';
import UpcomingAppointmentsHeader from './headers/upcomingAppointmentsHeader';
import AlphabeticalHeader from './headers/alphabeticalHeader';


class PrepareClients {
  static getSortTypes() {
    return [
      { id: 1, name: 'Alphabetical order: A-Z', type: 'sort' },
      { id: 2, name: 'Prefered Service Provider', type: 'sort' },
      { id: 3, name: 'Last Visit', type: 'sort' },
      { id: 4, name: 'Upcoming Appointments', type: 'sort' },
      { id: 5, name: 'Membership', type: 'sort' },
    ];
  }

  static getFilterTypes() {
    return [{ id: 1, name: 'Show deleted Clients', type: 'userType' }];
  }

  static compareByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  static getByValue(arr, value) {
    for (let i = 0, iLen = arr.length; i < iLen; i += 1) {
      if (arr[i].header === value) return arr[i];
    }
    return null;
  }


  static applyFilter(clients, filters) {
    if (filters.length > 0) {
      let filteredClients = [];
      let headerItem = AlphabeticalHeader;
      let listItem = AlphabeticalListItem;

      for (let i = 0; i < filters.length; i += 1) {
        const filter = filters[i];

        console.log(filter);

        if (filter.type === 'sort' && filter.id === 1) {
          // Alphabetical order: A-Z
          filteredClients = clients.sort(PrepareClients.compareByName);
          filteredClients = PrepareClients.prepareClientsAlphabetical(filteredClients);
          headerItem = AlphabeticalHeader;
          listItem = AlphabeticalListItem;
        } else if (filter.type === 'sort' && filter.id === 2) {
          // Prefered Service Provider
          // filteredClients = clients.sort(PrepareClients.compareByName);
          filteredClients = PrepareClients.prepareClientsPreferredProvider(clients);
          headerItem = PreferredProviderHeader;
          listItem = PreferredProviderClientListItem;
        } else if (filter.type === 'sort' && filter.id === 3) {
          // Last Visit
          // filteredClients = clients.sort(PrepareClients.compareByName);
          filteredClients = PrepareClients.prepareClientsLastVisit(clients);
          headerItem = LastVisitHeader;
          listItem = LastVisitClientListItem;
        } else if (filter.type === 'sort' && filter.id === 4) {
          // Upcoming Appointments
          // filteredClients = clients.sort(PrepareClients.compareByName);
          filteredClients = PrepareClients.prepareClientsUpcomingAppointments(clients);
          headerItem = UpcomingAppointmentsHeader;
          listItem = UpcomingAppointmentsClientListItem;
        } else if (filter.type === 'sort' && filter.id === 5) {
          // Membership
          // filteredClients = clients.sort(PrepareClients.compareByName);
          filteredClients = PrepareClients.prepareClientsMembership(clients);
          headerItem = MembershipHeader;
          listItem = MembershipClientListItem;
        }
      }

      return { clients: filteredClients, listItem, headerItem };
    }
    return {
      clients: clients.sort(PrepareClients.compareByName),
      listItem: AlphabeticalListItem,
      headerItem: AlphabeticalHeader,
    };
  }

  static prepareClientsAlphabetical(clients) {
    const dataSource = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];

      const result = PrepareClients.getByValue(
        dataSource,
        client.name.substring(0, 1).toUpperCase(),
      );

      if (result) {
        result.list.push(client);
      } else {
        dataSource.push({ list: [client], header: client.name.substring(0, 1).toUpperCase() });
      }
    }

    return dataSource;
  }


  static prepareClientsPreferredProvider(clients) {
    const dataSource = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];

      const result = PrepareClients.getByValue(
        dataSource,
        client.preferredProvider.name,
      );

      if (result) {
        result.list.push(client);
      } else {
        dataSource.push({ list: [client], header: client.preferredProvider.name, preferredProvider: client.preferredProvider });
      }
    }

    console.log(dataSource);
    return dataSource;
  }

  static prepareClientsMembership(clients) {
    const dataSource = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];

      const result = PrepareClients.getByValue(
        dataSource,
        client.membership,
      );

      if (result) {
        result.list.push(client);
      } else {
        dataSource.push({ list: [client], header: client.membership });
      }
    }

    console.log(dataSource);
    return dataSource;
  }


  static prepareClientsUpcomingAppointments(clients) {
    const dataSource = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      const date = client.nextAppointment ? client.nextAppointment.date : 'Dont have an Appointment';

      const result = PrepareClients.getByValue(
        dataSource,
        date,
      );

      if (result) {
        result.list.push(client);
      } else {
        dataSource.push({ list: [client], header: date, nextAppointment: client.nextAppointment });
      }
    }

    return dataSource;
  }

  static prepareClientsLastVisit(clients) {
    const dataSource = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      const date = client.lastAppointment ? client.lastAppointment.date : 'Never had an Appointment';

      const result = PrepareClients.getByValue(
        dataSource,
        date,
      );

      if (result) {
        result.list.push(client);
      } else {
        dataSource.push({ list: [client], header: date, lastAppointment: client.lastAppointment });
      }
    }

    return dataSource;
  }

  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;
      for (let n = 0; n < info.length; n += 1) {
        if (item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }
}

export default PrepareClients;
