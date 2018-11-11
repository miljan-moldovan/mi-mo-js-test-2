import React from 'react';
import { Text, View, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import SortableList from 'react-native-sortable-list';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

// import ApptBookSetEmployeeOrderHeader from './apptBookSetEmployeeOrderHeader';
import Row from './rowComponent';
import headerStyles from '../../../constants/headerStyles';
import SalonHeader from '../../../components/SalonHeader';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  list: {
    flex: 1,
    width: '100%',
  },
  leftButton: { paddingLeft: 10 },
  rightButton: { paddingRight: 10 },
  contentContainer: {
    width: window.width,
  },
  leftButtonText: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    fontSize: 14,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  rightButtonText: {
    backgroundColor: 'transparent',
    paddingRight: 10,
    fontSize: 14,
    color: 'white',
  },
});

export default class setEmployeesOrder extends React.PureComponent {
  // static navigationOptions = ({ navigation }) => ({
  //   header: (<ApptBookSetEmployeeOrderHeader params={navigation.state.params} />),
  // })


  static navigationOptions = ({ navigation }) => ({
    header: (
      <SalonHeader
        title="Set Employee Order"
        headerLeft={
          <SalonTouchableOpacity wait={3000} style={styles.leftButton} onPress={() => navigation.goBack()}>
            <Text style={styles.leftButtonText}>Cancel</Text>
          </SalonTouchableOpacity>
        }
        headerRight={
          <SalonTouchableOpacity wait={3000} style={styles.rightButton} onPress={navigation.getParam('handlePress', () => { })}>
            <Text style={styles.rightButtonText}>Done</Text>
          </SalonTouchableOpacity>
        }
      />
    ),
  })

  constructor(props) {
    super();
    props.apptBookSetEmployeeOrderActions.getEmployees();
    props.navigation.setParams({
      handlePress: () => this.saveOrder(),
      // handleGoBack: () => this.goBack(),
    });
  }

  goBack() {
    setTimeout(this.props.navigation.goBack, 300);
  }

  saveOrder = () => {
    const newOrder = [];

    if (this.order === null || this.order === undefined) {
      this.goBack();
      return;
    }

    for (let i = 0; i < this.order.length; i++) {
      const employee = this.props.apptBookSetEmployeeOrderState.employees[this.order[i]];
      employee.appointmentOrder = i;
      newOrder.push(employee);
    }

    this.props.apptBookSetEmployeeOrderActions.postEmployeesAppointmentOrder(newOrder).then(() => {
      this.goBack();
    });
  }

  handleChangeOrder = (nextOrder) => {
    this.order = nextOrder;
  }

  _renderRow = ({ data, active }) => <Row data={data} active={active} />


  render() {
    const { employees, isLoading } = this.props.apptBookSetEmployeeOrderState;
    return (
      <View style={styles.container}>

        {isLoading ?
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View> :
          <SortableList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            data={employees}
            renderRow={this._renderRow}
            // order={this.state.order}
            onChangeOrder={this.handleChangeOrder}
          />
        }
      </View>
    );
  }
}
