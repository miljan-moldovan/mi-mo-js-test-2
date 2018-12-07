import React, {Component} from 'react';
import moment from 'moment';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  InputGroup,
  InputButton,
  InputDivider,
  InputSwitch,
  SectionTitle,
  InputText,
} from '../../components/formHelpers';
import Icon from '@/components/common/Icon';
import fetchFormCache from '../../utilities/fetchFormCache';
import SalonTouchableHighlight from '../../components/SalonTouchableHighlight';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

const styles = StyleSheet.create ({
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {paddingLeft: 10},
  rightButton: {paddingRight: 10},
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
    zIndex: 0,
  },
  leftButtonText: {
    backgroundColor: 'transparent',
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
    fontSize: 14,
    color: 'white',
  },
});

const SelectedWithRemove = props => (
  <View style={{flexDirection: 'row'}}>
    <Text
      style={{
        color: '#110A24',
        fontSize: 14,
        lineHeight: 18,
        marginRight: 7,
        fontFamily: 'Roboto-Medium',
      }}
    >
      {props.value}
    </Text>
    <SalonTouchableHighlight onPress={() => props.onPressRemove ()}>
      <Icon name="timesCircle" size={20} color="#C0C1C6" type="solid" />
    </SalonTouchableHighlight>
  </View>
);

class ApptBookViewOptionsScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: (
      <SalonHeader
        title="View Options"
        headerLeft={
          <SalonTouchableOpacity
            wait={300}
            style={styles.leftButton}
            onPress={() => navigation.goBack ()}
          >
            <Text style={styles.leftButtonText}>Cancel</Text>
          </SalonTouchableOpacity>
        }
        headerRight={
          <SalonTouchableOpacity
            wait={300}
            style={styles.rightButton}
            onPress={navigation.getParam ('handlePress', () => {})}
          >
            <Text style={styles.rightButtonText}>Done</Text>
          </SalonTouchableOpacity>
        }
      />
    ),
  });

  constructor (props) {
    super (props);

    const {filterOptions} = this.props.apptBookState;

    this.props.navigation.setParams ({
      handlePress: this.saveOptions,
    });
    this.shouldSave = false;
    this.state = {
      options: filterOptions,
    };

    // this.props.employeeOrderActions.setOrderInitials();
    this.props.employeeOrderActions.getEmployees ();
    this.props.navigation.setParams ({hideTabBar: true});
  }

  componentDidUpdate (prevProps, prevState) {}

  saveOptions = () => {
    const {
      company,
      position,
      showMultiBlock,
      showOffEmployees,
      showRoomAssignments,
      showAssistantAssignments,
    } = this.state.options;
    this.props.apptBookActions.setFilterOptionCompany (company);
    this.props.apptBookActions.setFilterOptionPosition (position);
    this.props.apptBookActions.setFilterOptionShowOffEmployees (
      showOffEmployees
    );
    this.props.apptBookActions.setFilterOptionRoomAssignments (
      showRoomAssignments
    );
    this.props.apptBookActions.setFilterOptionAssistantAssignments (
      showAssistantAssignments
    );
    this.props.apptBookActions.setFilterOptionShowMultiBlock (showMultiBlock);

    this.props.apptBookActions.setGridView ();
    this.goBack ();
  };

  goBack = () => {
    this.props.navigation.setParams ({hideTabBar: false});
    this.props.navigation.goBack ();
  };

  handleChangeCompany = company => {
    this.setState ({options: {...this.state.options, company}});
  };

  handleChangePosition = position => {
    this.setState ({options: {...this.state.options, position}});
  };

  handleRemoveCompany = () =>
    this.setState ({options: {...this.state.options, company: null}});

  handleRemovePosition = () =>
    this.setState ({options: {...this.state.options, position: null}});

  goToEmployeesOrder = () => {
    this.props.navigation.navigate ('ApptBookSetEmployeeOrder', {
      transition: 'SlideFromBottom',
      dismissOnSelect: true,
    });
  };

  render () {
    const {position, company} = this.state.options;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          ref="scroll"
          extraHeight={300}
          enableAutoAutomaticScroll
        >
          <SectionTitle value="EMPLOYEE OPTIONS" style={{height: 38}} />
          <InputGroup>
            {[
              <InputButton
                key={Math.random ()}
                style={{flex: 1}}
                labelStyle={{color: '#110A24'}}
                onPress={() => {
                  this.props.navigation.navigate ('FilterByPosition', {
                    transition: 'SlideFromBottom',
                    onChangePosition: this.handleChangePosition,
                    dismissOnSelect: true,
                    selectedPosition: position,
                  });
                }}
                label="Filter By Position"
                value={
                  position === null
                    ? null
                    : <SelectedWithRemove
                        onPressRemove={this.handleRemovePosition}
                        value={position.name}
                      />
                }
              />,
              <InputDivider key={Math.random ()} />,
              <InputButton
                key={Math.random ()}
                style={{flex: 1}}
                labelStyle={{color: '#110A24'}}
                onPress={() => {
                  this.props.navigation.navigate ('FilterByCompany', {
                    transition: 'SlideFromBottom',
                    onChangeCompany: this.handleChangeCompany,
                    dismissOnSelect: true,
                    selectedCompany: company,
                  });
                }}
                label="Filter By Company"
                value={
                  company === null
                    ? null
                    : <SelectedWithRemove
                        onPressRemove={this.handleRemoveCompany}
                        value={company.name}
                      />
                }
              />,
              <InputDivider key={Math.random ()} />,
              <InputButton
                key={Math.random ()}
                style={{flex: 1}}
                labelStyle={{color: '#110A24'}}
                onPress={() => {
                  this.goToEmployeesOrder ();
                }}
                label="Set Employee Order"
                value={this.props.employeeOrderState.orderInitials}
              />,
              <InputDivider key={Math.random ()} />,
              <InputButton
                key={Math.random ()}
                style={{flex: 1}}
                labelStyle={{color: '#110A24'}}
                onPress={() => {
                  this.props.navigation.navigate ('ServiceCheck', {
                    transition: 'SlideFromBottom',
                    dismissOnSelect: true,
                  });
                }}
                label="Service Check"
                value={this.state.options.serviceCheck}
              />,
            ]}
          </InputGroup>
          <SectionTitle value="DISPLAY OPTIONS" style={{height: 38}} />
          <InputGroup>
            {[
              <InputSwitch
                key={Math.random ()}
                style={{height: 43}}
                textStyle={{color: '#000000'}}
                onChange={state => {
                  const {options} = this.state;
                  options.showRoomAssignments = !options.showRoomAssignments;
                  this.shouldSave = true;
                  this.setState ({options});
                }}
                value={this.state.options.showRoomAssignments}
                text="Room Assigments"
              />,
              <InputDivider key={Math.random ()} />,
              <InputSwitch
                key={Math.random ()}
                style={{height: 43}}
                textStyle={{color: '#000000'}}
                onChange={state => {
                  const {options} = this.state;
                  options.showAssistantAssignments = !options.showAssistantAssignments;
                  this.shouldSave = true;
                  this.setState ({options});
                }}
                value={this.state.options.showAssistantAssignments}
                text="Assistant Assigments"
              />,
              <InputDivider key={Math.random ()} />,
              <InputSwitch
                key={Math.random ()}
                style={{height: 43}}
                textStyle={{color: '#000000'}}
                onChange={state => {
                  const {options} = this.state;
                  options.showMultiBlock = !options.showMultiBlock;
                  this.shouldSave = true;
                  this.setState ({options});
                }}
                value={this.state.options.showMultiBlock}
                text="Client name in every blocks"
              />,
              <InputDivider key={Math.random ()} />,
              <InputSwitch
                key={Math.random ()}
                style={{height: 43}}
                textStyle={{color: '#000000'}}
                onChange={state => {
                  const {options} = this.state;
                  options.showOffEmployees = !options.showOffEmployees;
                  this.shouldSave = true;
                  this.setState ({options});
                }}
                value={this.state.options.showOffEmployees}
                text="Show employees that are off"
              />,
            ]}
          </InputGroup>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default ApptBookViewOptionsScreen;
