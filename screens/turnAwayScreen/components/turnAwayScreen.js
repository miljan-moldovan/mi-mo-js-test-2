import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import moment from 'moment';

import DatePicker from '../../../components/modals/SalonDatePicker';
import ClientRow from './clientRow';
import ServiceSection from './serviceSection';
import fetchFormCache from '../../../utilities/fetchFormCache';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

import {
  InputDivider,
} from '../../../components/formHelpers';

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
    //  borderBottomWidth: 1,
    // borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rowFirst: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C0C1C6',
  },
  dataContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  textData: {
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#19428A',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

class TurnAwayScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params && navigation.state.params.onDone ? navigation.state.params.onDone : () => {};

    return {
      headerTitle: <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Turn Away</Text>
      </View>,
      headerLeft:
  <View style={styles.leftButtonContainer}>
    <SalonTouchableOpacity
      onPress={() => { navigation.goBack(); }}
      style={styles.leftButton}
    >
      <Text style={styles.leftButtonText}>Cancel</Text>
    </SalonTouchableOpacity>
  </View>,
      headerRight: (
        <View style={styles.rightButtonContainer}>
          <SalonTouchableOpacity
            wait={3000}
            onPress={handlePress}
            style={styles.rightButton}
          >
            <Text style={styles.rightButtonText}>Done</Text>
          </SalonTouchableOpacity>
        </View>
      ),
    };
  };

  // static navigationOptions = rootProps => ({
  //   headerTitle: <Text style={styles.titleText}>Turn Away</Text>,
  //   headerLeft:
  // <SalonTouchableOpacity
  //   onPress={() => { rootProps.navigation.goBack(); }}
  // >
  //   <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
  // </SalonTouchableOpacity>,
  //
  //   headerRight: (
  //     <SalonTouchableOpacity
  //       wait={3000}
  //       onPress={rootProps.navigation.state.params ? rootProps.navigation.state.params.onDone : () => {}}
  //     >
  //       <Text style={{ fontSize: 14, color: 'white' }}>Done</Text>
  //     </SalonTouchableOpacity>
  //   ),
  // });

  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      isModalVisible: false,
      selectedClient: null,
      services: [],
    };

    this.props.navigation.setParams({ onDone: this.onDone.bind(this) });
  }


  componentWillMount() {
    // let note = this.state.note;
    //
    // const cachedForm = fetchFormCache('TurnAwayScreen', this.props.formCache);
    //
    // if (cachedForm) {
    //   note = cachedForm;
    // }
    //
    // this.setState({
    //   note,
    // });


  }

  isTurnAwayValid = () => true

  onDone() {
    alert('Not Implemented');
    // if (this.isTurnAwayValid()) {
    //   const services = [];
    //   for (let i = 0; i < this.state.services.length; i++) {
    //     const service = this.state.services[i];
    //     delete service.service;
    //     delete service.provider;
    //     service.toTime = service.toTime.format();
    //     service.fromTime = service.fromTime.format();
    //     services.push(service);
    //   }
    //
    //   const turnAway = {
    //     date: this.state.date.format('YYYY-MM-DD'),
    //     reasonCode: 'providerUnavail',
    //     reason: 'string',
    //     myClientId: this.state.selectedClient.id,
    //     isAppointmentBookTurnAway: true,
    //     services,
    //   };
    //
    //   this.props.turnAwayActions.postTurnAway(turnAway)
    //     .then((response) => {
    //       // this.getNotes();
    //     }).catch((error) => {
    //
    //     });
    // } else {
    //   alert('Please fill all the fields');
    // }
  }

  handleAddService= () => {
    const service = {
      provider: null,
      service: null,
      fromTime: moment(),
      toTime: moment().add(1, 'hours'),
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
    this.setState({ date: moment(data), isModalVisible: false });
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
            <Text onPress={this.handleDateModal} style={styles.textData}>{this.state.date.format('DD MMMM YYYY')}</Text>
          </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#FFFFFF' }} ><InputDivider style={{ marginHorizontal: 16 }} /></View>
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
