import AlphabeticalListItem from './items/alphabeticalListItem';

import AlphabeticalHeader from './headers/alphabeticalHeader';


class PrepareClients {
  static getSortTypes() {
    return [
      { id: 1, name: 'Alphabetical order: A-Z', type: 'sort' },
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
