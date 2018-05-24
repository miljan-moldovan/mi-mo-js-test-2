import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  InputGroup,
  InputButton,
  InputDivider,
  InputSwitch,
  SectionTitle,
  InputText,
} from '../../components/formHelpers';
import Icon from '../../components/UI/Icon';
import fetchFormCache from '../../utilities/fetchFormCache';
import ApptBookViewOptionsHeader from './components/apptBookViewOptionsHeader';
import SalonTouchableHighlight from '../../components/SalonTouchableHighlight';


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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
    zIndex: 0,
  },
});

const SelectedWithRemove = props => (
  <View style={{ flexDirection: 'row' }}>
    <Text style={{
      color: '#110A24',
      fontSize: 14,
      lineHeight: 18,
      marginRight: 7,
      fontFamily: 'Roboto-Medium',
    }}
    >{props.value}
    </Text>
    <SalonTouchableHighlight
      onPress={() => props.onPressRemove()}
    >
      <Icon
        name="timesCircle"
        size={20}
        color="#C0C1C6"
        type="solid"
      />
    </SalonTouchableHighlight>
  </View>
);

class ApptBookViewOptionsScreen extends Component {
  constructor(props) {
    super(props);

    const {
      filterOptions,
    } = this.props.apptBookState;

    this.props.navigation.setParams({
      handlePress: this.saveOptions,
      handleGoBack: this.goBack,
    });
    this.shouldSave = false;
    this.state = {
      isVisibleViewOptions: true,
      options: filterOptions,
    };

    // this.props.employeeOrderActions.setOrderInitials();
    this.props.employeeOrderActions.getEmployees();
  }

  componentDidUpdate(prevProps, prevState) {

  }

  saveOptions = () => {
    const {
      company,
      position,
      showMultiBlock,
      showOffEmployees,
      showRoomAssignments,
      showAssistantAssignments,
    } = this.state.options;
    this.props.apptBookActions.setFilterOptionCompany(company);
    this.props.apptBookActions.setFilterOptionPosition(position);
    this.props.apptBookActions.setFilterOptionShowOffEmployees(showOffEmployees);
    this.props.apptBookActions.setFilterOptionRoomAssignments(showRoomAssignments);
    this.props.apptBookActions.setFilterOptionAssistantAssignments(showAssistantAssignments);
    this.props.apptBookActions.setFilterOptionShowMultiBlock(showMultiBlock);

    this.props.apptBookActions.setGridView();
    this.goBack();
  }

  goBack = () => {
    this.setState({ isVisibleViewOptions: false });
    this.props.navigation.goBack();
  }

  handleOnNavigateBack = () => {
    this.setState({ isVisibleViewOptions: true });
  }

  handleChangeCompany = (company) => {
    this.setState({ options: { ...this.state.options, company } });
  }

  handleChangePosition = (position) => {
    this.setState({ options: { ...this.state.options, position } });
  }

  handleRemoveCompany = () => this.setState({ options: { ...this.state.options, company: null } });

  handleRemovePosition = () => this.setState({ options: { ...this.state.options, position: null } });

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisibleViewOptions: true });
    navigate('ApptBookViewOptions');
  }

  goToEmployeesOrder = () => {
    this.setState({ isVisibleViewOptions: false });
    this.props.navigation.navigate(
      'ApptBookSetEmployeeOrder',
      {
        dismissOnSelect: this.dismissOnSelect,
        onNavigateBack: this.handleOnNavigateBack,
      },
    );
  }

  render() {
    const {
      position,
      company,
    } = this.state.options;

    return (
      <Modal
        key="ApptBookViewOptionsScreen"
        isVisible={this.state.isVisibleViewOptions}
        style={styles.modal}
      >
        <View style={styles.container}>
          <ApptBookViewOptionsHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <SectionTitle value="EMPLOYEE OPTIONS" style={{ height: 38 }} />
            <InputGroup>
              {[<InputButton
                key={Math.random()}
                style={{ flex: 1 }}
                labelStyle={{ color: '#110A24' }}
                onPress={() => {
                  this.setState({ isVisibleViewOptions: false });
                  this.props.navigation.navigate(
                    'FilterByPosition',
                    {
                      dismissOnSelect: this.dismissOnSelect,
                      onNavigateBack: this.handleOnNavigateBack,
                      onChangePosition: this.handleChangePosition,
                    },
                  );
                }}
                label="Filter By Position"
                value={position === null ? null : (
                  <SelectedWithRemove
                    onPressRemove={this.handleRemovePosition}
                    value={position.name}
                  />
                )}
              />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => {
                    this.setState({ isVisibleViewOptions: false });
                    this.props.navigation.navigate(
                      'FilterByCompany',
                      {
                        dismissOnSelect: this.dismissOnSelect,
                        onNavigateBack: this.handleOnNavigateBack,
                        onChangeCompany: this.handleChangeCompany,
                      },
                    );
                    }}
                  label="Filter By Company"
                  value={company === null ? null : (
                    <SelectedWithRemove
                      onPressRemove={this.handleRemoveCompany}
                      value={company.name}
                    />
                  )}
                />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { this.goToEmployeesOrder(); }}
                  label="Set Employee Order"
                  value={this.props.employeeOrderState.orderInitials}
                />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => {
                    this.setState({ isVisibleViewOptions: false });
                    this.props.navigation.navigate(
                      'ServiceCheck',
                      {
                        dismissOnSelect: this.dismissOnSelect,
                        onNavigateBack: this.handleOnNavigateBack,
                      },
                    );
                  }}
                  label="Service Check"
                  value={this.state.options.serviceCheck}
                />]}
            </InputGroup>
            <SectionTitle value="DISPLAY OPTIONS" style={{ height: 38 }} />
            <InputGroup>
              {[<InputSwitch
                key={Math.random()}
                style={{ height: 43 }}
                textStyle={{ color: '#000000' }}
                onChange={(state) => {
                  const { options } = this.state;
                  options.showRoomAssignments = !options.showRoomAssignments;
                  this.shouldSave = true;
                  this.setState({ options });
                }}
                value={this.state.options.showRoomAssignments}
                text="Room Assigments"
              />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                    const { options } = this.state;
                    options.showAssistantAssignments = !options.showAssistantAssignments;
                    this.shouldSave = true;
                    this.setState({ options });
                  }}
                  value={this.state.options.showAssistantAssignments}
                  text="Assistant Assigments"
                />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                      const { options } = this.state;
                      options.showMultiBlock = !options.showMultiBlock;
                      this.shouldSave = true;
                      this.setState({ options });
                    }}
                  value={this.state.options.showMultiBlock}
                  text="Client name in every blocks"
                />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                        const { options } = this.state;
                        options.showOffEmployees = !options.showOffEmployees;
                        this.shouldSave = true;
                        this.setState({ options });
                      }}
                  value={this.state.options.showOffEmployees}
                  text="Show employees that are off"
                />]}
            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default ApptBookViewOptionsScreen;
