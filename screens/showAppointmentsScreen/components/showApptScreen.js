import React from 'react';
import { View, SectionList, Text } from 'react-native';

import Card from './card';
import styles from './styles';

const sections = [
  {
    title: '2018-08-08',
    data: [
      {
        date: '2018-08-08T00:00:00',
        start: '13:45:00',
        end: '14:30:00',
        storeId: 1,
        storeName: 'Zona Norwell',
        employeeId: 491,
        employeeName: 'Amanda E Hamaty',
        serviceId: 93,
        serviceDescription: 'Bridal Makeup',
        clientId: 24,
        clientName: 'Beth Allard',
        requested: true,
        id: 774144,
        updateStamp: 1533748172084314,
        isDeleted: false,
      },
      {
        date: '2018-08-08T00:00:00',
        start: '18:30:00',
        end: '19:15:00',
        storeId: 1,
        storeName: 'Zona Norwell',
        employeeId: 1791,
        employeeName: 'David Ginebra',
        serviceId: 93,
        serviceDescription: 'Bridal Makeup',
        clientId: 24,
        clientName: 'Beth Allard',
        requested: false,
        id: 774149,
        updateStamp: 1533748138816091,
        isDeleted: false,
      },
    ],
  },
  {
    title: '2018-08-18',
    data: [
      {
        date: '2018-08-18T00:00:00',
        start: '08:00:00',
        end: '09:45:00',
        storeId: 1,
        storeName: 'Zona Norwell',
        employeeId: 0,
        employeeName: '',
        serviceId: 30,
        serviceDescription: '1 Formula Foil',
        clientId: 24,
        clientName: 'Beth Allard',
        requested: false,
        id: 773998,
        updateStamp: 1533047424592687,
        isDeleted: false,
      },
    ],
  },
  {
    title: '2018-08-20',
    data: [
      {
        date: '2018-08-20T00:00:00',
        start: '09:00:00',
        end: '09:45:00',
        storeId: 1,
        storeName: 'Zona Norwell',
        employeeId: 1791,
        employeeName: 'David Ginebra',
        serviceId: 17,
        serviceDescription: 'Color Adjustment',
        clientId: 24,
        clientName: 'Beth Allard',
        requested: true,
        id: 774002,
        updateStamp: 1533048480370272,
        isDeleted: false,
      },
      {
        date: '2018-08-20T00:00:00',
        start: '09:00:00',
        end: '09:45:00',
        storeId: 1,
        storeName: 'Zona Norwell',
        employeeId: 2,
        employeeName: 'Beth Beaulieu',
        serviceId: 17,
        serviceDescription: 'Color Adjustment',
        clientId: 24,
        clientName: 'Beth Allard',
        requested: true,
        id: 774003,
        updateStamp: 1533048520620377,
        isDeleted: false,
      },
    ],
  },
];
class ShowApptScreen extends React.Component {
  componentWillMount() {
    console.log("BACON");
  }

  keyExtractor = section => section.title;

  renderItem = ({ item }) => <Card item={item} />

  renderSectionHeader = ({ section: { title }}) => (
    <Text style={styles.sectionText}>{title}</Text>
  )

  render() {
    return (
      <SectionList
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        keyExtractor={this.keyExtractor}
        sections={sections}
      />
    );
  }
}

export default ShowApptScreen;
