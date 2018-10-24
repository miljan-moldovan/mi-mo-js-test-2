import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import SortableList from 'react-native-sortable-list';

import ApptBookSetEmployeeOrderHeader from './apptBookSetEmployeeOrderHeader';
import Row from './rowComponent';

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

  contentContainer: {
    width: window.width,
  },
});

export default class setEmployeesOrder extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: (<ApptBookSetEmployeeOrderHeader params={navigation.state.params} />),
  })

  constructor(props) {
    super();
    props.apptBookSetEmployeeOrderActions.getEmployees();
    props.navigation.setParams({
      handlePress: () => this.saveOrder(),
      handleGoBack: () => this.goBack(),
    });
  }

  goBack() {
    this.props.navigation.state.params.onNavigateBack();
    setTimeout(this.props.navigation.goBack, 300);
  }


  componentWillUnmount() {
    this.props.navigation.state.params.onNavigateBack();
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

        {isLoading ? null :
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
