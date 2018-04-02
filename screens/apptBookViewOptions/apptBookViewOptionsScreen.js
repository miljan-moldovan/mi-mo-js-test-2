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
  },
});

class AppointmentNoteScreen extends Component {
  state = {
    isVisible: true,
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
    this.setState({ isVisible: false });
    this.props.navigation.goBack();
  }

  handleOnNavigateBack = () => {
    this.setState({ isVisible: true });
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('AppointmentNoteScreen');
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}
      >
        <View style={styles.container}>
          <ApptBookViewOptionsHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <SectionTitle value="EMPLOYEE OPTIONS" style={{ height: 38 }} />
            <InputGroup>
              {[<InputButton
                style={{ flex: 1 }}
                labelStyle={{ color: '#110A24' }}
                onPress={() => { alert('Not implemented'); }}
                label="Filter By Position"
                value={this.state.options.position}
              />,
                <InputDivider />,
                <InputButton
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { alert('Not implemented'); }}
                  label="Filter By Company"
                  value={this.state.options.company}
                />,
                <InputDivider />,
                <InputButton
                  style={{ flex: 1 }}
                  labelStyle={{ color: '#110A24' }}
                  onPress={() => { alert('Not implemented'); }}
                  label="Set Employee Order"
                  value={this.state.options.employeeOrder}
                />,
                <InputDivider />,
                <InputButton
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
                <InputDivider />,
                <InputSwitch
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
                <InputDivider />,
                <InputSwitch
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
                <InputDivider />,
                <InputSwitch
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
                <InputDivider />]}
            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default AppointmentNoteScreen;
