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
  },
  weeksTextSyle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
});

class RebookDialogScreen extends Component {
  state = {
    date: moment(),
    weeks: 0,
    updateRebookingPref: false,
    isVisible: true,
  };

  componentWillMount() {
    const { appointment } = this.props.navigation.state.params;

    this.props.navigation.setParams({
      handlePress: () => this.saveRebook(),
      handleGoBack: () => this.goBack(),
    });
  }


  goBack() {
    this.setState({ isVisible: false });
    this.props.navigation.goBack();
  }

  saveRebook() {
    alert('Not Implemented. Endpoint missing.');
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('RebookDialog');
  }

  onChangeWeeks = (operation, weeks) => {
    if (operation === 'add') {
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').add(1, 'weeks'), weeks });
    } else {
      debugger //eslint-disable-line
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').subtract(1, 'weeks'), weeks });
    }
  }

  shouldSave = false

  render() {
    return (
      <View style={styles.container}>
        <RebookDialogHeader rootProps={this.props} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
          <SectionTitle value="HOW MANY WEEKS AHEAD TO REBOOK?" style={{ height: 37 }} />
          <InputGroup >
            {[<InputNumber key={Math.random()} onChange={(operation, weeks) => { this.onChangeWeeks(operation, weeks); }} textStyle={styles.weeksTextSyle} value={this.state.weeks} singularText="week" pluralText="weeks" min={0} />,
              <InputDivider key={Math.random()} />,
              <InputLabel
                key={Math.random()}
                label={this.state.date.format('DD MMMM YYYY')}
              />,
              <InputDivider key={Math.random()} />,
              <InputSwitch
                key={Math.random()}
                style={{ height: 43 }}
                textStyle={{ color: '#000000' }}
                onChange={(state) => {
                  let { updateRebookingPref } = this.state;
                  updateRebookingPref = !this.state.updateRebookingPref;
                  this.shouldSave = true;
                  this.setState({ updateRebookingPref: !this.state.updateRebookingPref });
                }}
                value={this.state.updateRebookingPref}
                text="Update rebooking pref."
              />,

            ]}

          </InputGroup>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default RebookDialogScreen;
