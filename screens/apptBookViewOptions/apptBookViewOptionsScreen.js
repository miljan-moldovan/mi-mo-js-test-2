import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
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

import fetchFormCache from '../../utilities/fetchFormCache';
import ApptBookViewOptionsHeader from './components/apptBookViewOptionsHeader';

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

class ApptBookViewOptionsScreen extends Component {
  state = {
    isVisibleViewOptions: true,
    options: {},
  };

  componentWillMount() {
    this.props.navigation.setParams({
      handlePress: () => this.saveOptions(),
      handleGoBack: () => this.goBack(),
    });
  }

  componentDidUpdate(prevProps, prevState) {

  }

  saveOptions = () => {
    alert('Not implemented');
  }

  shouldSave = false

  goBack() {
    this.setState({ isVisibleViewOptions: false });
    this.props.navigation.goBack();
  }

  handleOnNavigateBack = () => {
    this.setState({ isVisibleViewOptions: true });
  }

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
                onPress={() => { alert('Not implemented'); }}
                label="Filter By Position"
                value={this.state.options.position}
              />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { alert('Not implemented'); }}
                  label="Filter By Company"
                  value={this.state.options.company}
                />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { this.goToEmployeesOrder(); }}
                  label="Set Employee Order"
                  value={this.state.options.employeeOrder}
                />,
                <InputDivider key={Math.random()} />,
                <InputButton
                  key={Math.random()}
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { alert('Not implemented'); }}
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
                  options.roomAssigments = !options.roomAssigments;
                  this.shouldSave = true;
                  this.setState({ options });
                }}
                value={this.state.options.roomAssigments}
                text="Room Assigments"
              />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                    const { options } = this.state;
                    options.assistantAssigments = !options.assistantAssigments;
                    this.shouldSave = true;
                    this.setState({ options });
                  }}
                  value={this.state.options.assistantAssigments}
                  text="Assistant Assigments"
                />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                      const { options } = this.state;
                      options.clientNameInEveryBlocks = !options.clientNameInEveryBlocks;
                      this.shouldSave = true;
                      this.setState({ options });
                    }}
                  value={this.state.options.clientNameInEveryBlocks}
                  text="Client name in every blocks"
                />,
                <InputDivider key={Math.random()} />,
                <InputSwitch
                  key={Math.random()}
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                        const { options } = this.state;
                        options.showEmployeesThatAreOff = !options.showEmployeesThatAreOff;
                        this.shouldSave = true;
                        this.setState({ options });
                      }}
                  value={this.state.options.showEmployeesThatAreOff}
                  text="Show employees that are off"
                />,
                <InputDivider key={Math.random()} />]}
            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default ApptBookViewOptionsScreen;
