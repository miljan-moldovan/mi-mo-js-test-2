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
  InputNumber,
  InputSwitch,
  InputDivider,
  SectionTitle,
  InputLabel,
} from '../../components/formHelpers';

import fetchFormCache from '../../utilities/fetchFormCache';

import RebookDialogHeader from './components/rebookDialogHeader';

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
    backgroundColor: '#F1F1F1',
    width: '100%',
  },
  weeksTextSyle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
});

class RebookDialogScreen extends Component {
  state = {
    rebook: {
      id: Math.random().toString(),

    },
    appointment: {},
    updateRebookingPref: false,
    isVisible: true,
  };

  componentWillMount() {
    // let { appointment } = {};// /this.props.navigation.state.params;
    //
    // const cachedForm = fetchFormCache('RebookDialogScreenUpdate', this.props.rebookDialogState.onEditionRebook.id, this.props.formCache);
    //
    // if (appointment.id === cachedForm.id) {
    //   appointment = cachedForm;
    // }
    //
    // this.setState({
    //   appointment, updateRebookingPref: appointment.updateRebookingPref,
    // });
    //
    // this.props.navigation.setParams({
    //   handlePress: () => this.saveRebook(),
    //   handleGoBack: () => this.goBack(),
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { appointment } = this.props.navigation.state.params;
      if (this.shouldSave) {
        this.shouldSave = false;
        this.props.rebookDialogActions.setAppointmentRebookNewForm(
          appointment.client.id.toString(),
          prevState.rebook,
        );
      }
    } else if (this.shouldSave) {
      this.shouldSave = false;
      this.props.rebookDialogActions.setAppointmentRebookUpdateForm(prevState.rebook);
    }
  }

  shouldSave = false

  goBack() {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { appointment } = this.props.navigation.state.params;
      this.props.rebookDialogActions.purgeAppointmentRebookNewForm(
        appointment.client.id.toString(),
        this.state.rebook,
      );
    } else {
      this.props.rebookDialogActions.purgeAppointmentRebookUpdateForm(this.state.rebook);
    }
    this.setState({ isVisible: false });
    this.props.navigation.goBack();
  }

  isRebookValid() {
    if (this.state.rebook.text.length === 0) {
      return false;
    } else if (this.state.rebook.author === '') {
      return false;
    }

    return true;
  }
  //
  // saveRebook() {
  //   if (this.isRebookValid()) {
  //     const rebooks = this.props.rebookDialogState.rebooks;
  //     const { appointment } = this.props.navigation.state.params;
  //
  //     if (this.props.navigation.state.params.actionType === 'new') {
  //       const rebook = this.state.rebook;
  //       rebook.rebooks = rebook.text;
  //       this.props.rebookDialogActions.postAppointmentRebooks(appointment.client.id, rebook)
  //         .then((response) => {
  //           this.getRebooks();
  //         }).catch((error) => {
  //           console.log(error);
  //         });
  //     } else if (this.props.navigation.state.params.actionType === 'update') {
  //       const rebook = this.state.rebook;
  //       rebook.rebooks = rebook.text;
  //       this.props.rebookDialogActions.putAppointmentRebooks(appointment.client.id, rebook)
  //         .then((response) => {
  //           this.getRebooks();
  //         }).catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   } else {
  //     alert('Please fill all the fields');
  //   }
  // }


  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('RebookDialogScreen');
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}
      >
        <View style={styles.container}>
          <RebookDialogHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <SectionTitle value="HOW MANY WEEKS AHEAD TO REBOOK?" style={{ height: 37 }} />
            <InputGroup >
              {[<InputNumber textStyle={styles.weeksTextSyle} value={1} singularText="week" pluralText="weeks" min={1} />,
                <InputDivider />,
                <InputLabel
                  label="16 March 2018"
                />,
                <InputDivider />,
                <InputSwitch
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                  const rebook = this.state.rebook;
                  rebook.updateRebookingPref = !this.state.updateRebookingPref;
                  this.shouldSave = true;
                  this.setState({ rebook, updateRebookingPref: !this.state.updateRebookingPref });
                }}
                  value={this.state.updateRebookingPref}
                  text="Update rebooking pref."
                />,

            ]}

            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default RebookDialogScreen;
