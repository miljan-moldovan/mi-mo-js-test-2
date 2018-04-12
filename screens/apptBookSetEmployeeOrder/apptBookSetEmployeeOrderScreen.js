import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import SortableListView from 'react-native-sortable-listview';
import fetchFormCache from '../../utilities/fetchFormCache';
import ApptBookSetEmployeeOrderHeader from './components/apptBookSetEmployeeOrderHeader';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';
import apiWrapper from '../../utilities/apiWrapper';


const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
  providerContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },
  rowContainer: {
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: 1,
  },
});

class RowComponent extends React.Component {
  render() {
    const { fullName, id } = this.props.employee;

    return (
      <TouchableHighlight
        underlayColor="#eee"
        style={styles.rowContainer}
        {...this.props.sortHandlers}
      >
        <View style={styles.providerContainer}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={30}
            borderWidth={1}
            borderColor="transparent"
            image={{ uri: apiWrapper.getEmployeePhoto(id) }}
          />
          <Text style={{ fontSize: 14, flex: 1, color: '#110A24' }}>{fullName}</Text>
          <Icon name="bars" size={20} color="#C0C1C6" type="solid" />
        </View>
      </TouchableHighlight>
    );
  }
}

class ApptBookSetEmployeeOrderScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (<ApptBookSetEmployeeOrderHeader params={navigation.state.params} />),
  })

  static compareByOrder(a, b) {
    if (a.appointmentOrder < b.appointmentOrder) { return -1; }
    if (a.appointmentOrder > b.appointmentOrder) { return 1; }
    return 0;
  }


  state = {
    isVisibleEmployeeOrder: true,
    employees: {},
    orderEmployees: {},
    order: Object.keys({}),
  };


  componentWillMount() {
    this.getEmployees();

    this.props.navigation.setParams({
      handlePress: () => this.saveOrder(),
      handleGoBack: () => this.goBack(),
    });
  }


  getEmployees = () => {
    this.props.apptBookSetEmployeeOrderActions.getEmployees({})
      .then((response) => {
        const orderEmployees = response.data.employees.sort(ApptBookSetEmployeeOrderScreen.compareByOrder);

        const employees = {};
        const orderIds = [];

        for (let i = 0; i < orderEmployees.length; i++) {
          const employee = orderEmployees[i];
          employees[employee.id] = employee;
          orderIds.push(employee.id.toString());
        }

        this.props.apptBookSetEmployeeOrderActions.setEmployees(orderEmployees);
        this.props.apptBookSetEmployeeOrderActions.setFilteredEmployees(employees);
        this.setState({ employees, order: orderIds, orderEmployees });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveOrder = () => {
    const newOrder = [];
    for (var i = 0; i < this.state.order.length; i++) {
      const employee = this.props.apptBookSetEmployeeOrderState.employees.find(employee => employee.id === parseInt(this.state.order[i]));
      employee.appointmentOrder = i;
      newOrder.push(employee);
    }


    this.props.apptBookSetEmployeeOrderActions.postEmployeesAppointmentOrder(newOrder)
      .then((response) => {
        this.getEmployees();
      }).catch((error) => {
        console.log(error);
      });
  }

  shouldSave = false

  goBack() {
    this.setState({ isVisibleEmployeeOrder: false });
    this.props.navigation.state.params.onNavigateBack();
    this.props.navigation.goBack();
  }

  handleOnNavigateBack = () => {
    this.setState({ isVisibleEmployeeOrder: true });
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisibleEmployeeOrder: true });
    navigate('ApptBookSetEmployeeOrder');
  }


  render() {
    return (
      <View style={styles.container}>
        <SortableListView
          style={{ flex: 1, marginBottom: 0 }}

          renderRow={row => <RowComponent employee={row} />}
          order={this.state.order}
          data={this.state.employees}
          onRowMoved={(e) => {
            let order = this.state.order;

            order = order.splice(e.to, 0, order.splice(e.from, 1)[0]);
          }}

          disableAnimatedScrolling
        />
      </View>
    );
  }
}

export default ApptBookSetEmployeeOrderScreen;
