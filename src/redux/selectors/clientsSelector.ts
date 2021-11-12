import {createSelector} from 'reselect';

export const clientsSelector = state => state.clientsReducer.clients;

const getClientSectionListDataSource = createSelector (
  clientsSelector,
  clients => {
    const clientsLetters = [];
    let firstLetter = '';
    let nextLetter = '';
    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];

      nextLetter = client.name.substring (0, 1).toUpperCase ();
      const isNumber = !isNaN (parseInt (nextLetter, 10));
      nextLetter = isNumber ? '#' : nextLetter;
      const isNewSection = !firstLetter || firstLetter !== nextLetter;
      if (isNewSection) {
        clientsLetters.push ({data: [client], title: nextLetter});
      } else {
        clientsLetters[clientsLetters.length - 1].data.push (client);
      }
      firstLetter = nextLetter;
    }
    return clientsLetters;
  }
);

export default getClientSectionListDataSource;
