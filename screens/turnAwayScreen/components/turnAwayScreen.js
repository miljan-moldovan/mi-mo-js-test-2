import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import moment from 'moment';

import DatePicker from '../../../components/modals/SalonDatePicker';
import ClientRow from './clientRow';
import ServiceSection from './serviceSection';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingTop: 18,
  },
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rowFirst: {
    borderTopWidth: 1,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Roboto-Medium',
    color: '#727A8F',
    fontSize: 14,
  },
  textData: {
    fontFamily: 'Roboto-Medium',
    color: '#110A24',
    fontSize: 14,
  },
  iconStyle: {
    tintColor: '#727A8F',
    marginLeft: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleRow: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: '#727A8F',
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});

class TurnAwayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('DD MMMM YYYY'),
      isModalVisible: false,
      selectedClient: null,
      services: [],
    };
  }

  handleAddService= () => {
    const service = {
      provider: null,
      service: null,
      start: moment(),
      end: moment().add(1, 'hours'),
    };
    const { services } = this.state;
    services.push(service);
    this.setState({ services });
  }

  handleRemoveService= (index) => {
    const { services } = this.state;
    services.splice(index, 1);
    this.setState({ services });
  }

  handleUpdateService= (index, service) => {
    const { services } = this.state;
    services[index] = service;
    this.setState({ services });
  }

  handleDateModal = () => {
    this.setState({ isModalVisible: true });
  }

  handleSelectDate = (data) => {
    this.setState({ date: moment(data).format('DD MMMM YYYY'), isModalVisible: false });
  }

  handlePressClient = () => {
    const { navigate } = this.props.navigation;

    navigate('Clients', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: this.handleClientSelection,
    });
  }

  handleClientSelection = (client) => {
    this.setState({ selectedClient: client });
  }

  handleRemoveClient = () => {
    this.setState({ selectedClient: null });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.row, styles.rowFirst]}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dataContainer}>
            <Text onPress={this.handleDateModal} style={styles.textData}>{this.state.date}</Text>
          </View>
        </View>
        <ClientRow
          client={this.state.selectedClient}
          onPress={this.handlePressClient}
          onCrossPress={this.handleRemoveClient}
        />
        <View style={styles.titleRow}>
          <Text style={styles.title}>SERVICES</Text>
        </View>
        <ServiceSection
          services={this.state.services}
          onAdd={this.handleAddService}
          onRemove={this.handleRemoveService}
          onUpdate={this.handleUpdateService}
          navigate={navigate}
        />
        <DatePicker onPress={this.handleSelectDate} isVisible={this.state.isModalVisible} />
      </ScrollView>
    );
  }
}

export default TurnAwayScreen;
