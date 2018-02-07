
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
    let showLateralList = true;

    if (filters.length > 0) {
      let prepared = [];
      let headerItem = AlphabeticalHeader;
      let listItem = AlphabeticalListItem;

      for (let i = 0; i < filters.length; i += 1) {
        const filter = filters[i];

        if (filter.type === 'sort' && filter.id === 1) {
          // Alphabetical order: A-Z
          prepared = clients.sort(PrepareClients.compareByName);
          prepared = PrepareClients.prepareClientsAlphabetical(prepared);
          headerItem = AlphabeticalHeader;
          listItem = AlphabeticalListItem;
          showLateralList = true;
        } else if (filter.type === 'sort' && filter.id === 2) {
          // Prefered Service Provider
          // prepared = clients.sort(PrepareClients.compareByName);
          prepared = PrepareClients.prepareClientsPreferredProvider(clients);
          prepared = PrepareClients.orderSubLists(prepared);
          headerItem = PreferredProviderHeader;
          listItem = PreferredProviderClientListItem;
          showLateralList = true;
        } else if (filter.type === 'sort' && filter.id === 3) {
          // Last Visit
          // prepared = clients.sort(PrepareClients.compareByName);
          prepared = PrepareClients.prepareClientsLastVisit(clients);
          prepared = PrepareClients.orderSubLists(prepared);
          headerItem = LastVisitHeader;
          listItem = LastVisitClientListItem;
          showLateralList = false;
        } else if (filter.type === 'sort' && filter.id === 4) {
          // Upcoming Appointments
          // prepared = clients.sort(PrepareClients.compareByName);
          prepared = PrepareClients.prepareClientsUpcomingAppointments(clients);
          prepared = PrepareClients.orderSubLists(prepared);
          headerItem = UpcomingAppointmentsHeader;
          listItem = UpcomingAppointmentsClientListItem;
          showLateralList = false;
        } else if (filter.type === 'sort' && filter.id === 5) {
          // Membership
          // prepared = clients.sort(PrepareClients.compareByName);
          prepared = PrepareClients.prepareClientsMembership(clients);
          prepared = PrepareClients.orderSubLists(prepared);
          headerItem = MembershipHeader;
          listItem = MembershipClientListItem;
          showLateralList = true;
        }
      }

      return {
        clients, prepared, listItem, headerItem, showLateralList,
      };
    }

    const prepared = clients.sort(PrepareClients.compareByName);

    return {
      clients,
      prepared,
      listItem: AlphabeticalListItem,
      headerItem: AlphabeticalHeader,
      showLateralList,
    };
  }


  static orderSubLists(dataSource) {
    for (let i = 0; i < dataSource.length; i += 1) {
      let subList = dataSource[i].list;
      subList = subList.sort(PrepareClients.compareByName);
      dataSource[i].list = subList;
    }
    return dataSource;
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
        dataSource.push({
          list: [client], header: client.preferredProvider.name, preferredProvider: client.preferredProvider,
        });
      }
    }
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
        dataSource.push({
          list: [client], header: date, nextAppointment: client.nextAppointment,
        });
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
        dataSource.push({
          list: [client], header: date, lastAppointment: client.lastAppointment,
        });
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
        if (item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
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
