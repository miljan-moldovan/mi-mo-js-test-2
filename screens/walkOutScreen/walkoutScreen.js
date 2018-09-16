import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  ProviderInput,
  InputGroup,
  SectionDivider,
  SectionTitle,
  InputRadioGroup,
  InputText,
} from '../../components/formHelpers';
import styles from './styles';

import WalkoutReasonsEnum from '../../constants/WalkoutReasons';

const walkoutReasons = [
  { id: WalkoutReasonsEnum.WaitedTooMuch, name: 'Waited too much' },
  { id: WalkoutReasonsEnum.PersonalAffairs, name: 'Personal Affairs' },
  { id: WalkoutReasonsEnum.ProviderDidntShowUp, name: 'Provider didn\'t show up' },
  { id: WalkoutReasonsEnum.Other, name: 'Other' },
];

class WalkoutScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params &&
    navigation.state.params.handlePress
      ? navigation.state.params.handlePress
      : () => {};
    const { name, lastName } = navigation.state.params.appointment.client;

    const params = navigation.state.params || {};
    const canSave = params.canSave || false;

    return {
      headerTitle:
  <View style={styles.titleContainer}>
    <Text style={styles.titleText}>Walk-out</Text>
    <Text style={styles.subTitleText}>{`${name} ${lastName}`}</Text>
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
            disabled={!canSave}
          >
            <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
          </SalonTouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      removalReasonTypeId: -1,
      isOtherReasonSelected: false,
      otherReason: '',
      employeeId: 0,
      provider: null,
      removalReasonType: null,
    };


    this.props.navigation.setParams({ handlePress: this.handleAlert });
  }

  componentWillMount() {
    const { appointment } = this.props.navigation.state.params;
    const service = appointment.services[0];
    const provider = service.isFirstAvailable ?
      {
        id: 0, isFirstAvailable: true, lastName: 'Available', name: 'First',
      } : service.employee;

    this.setState({ provider, employeeId: provider.id });
  }

  onChangeProvider = (provider) => {
    this.setState({ provider, employeeId: provider.id }, this.checkCanSave);
  }

  handleAlert = () => {
    const { appointment } = this.props.navigation.state.params;
    const { client } = appointment;

    const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;

    Alert.alert(
      'WALK-OUT',
      `Are you sure you want to mark ${fullName} as a walk-out?`,
      [
        { text: 'No, cancel', onPress: () => { console.log('cancel'); }, style: 'cancel' },
        {
          text: 'Yes, I’m sure',
          onPress: () => {
            this.handleWalkout();
          },
        },
      ],
      { cancelable: false },
    );
  }
  handleWalkout = () => {
    const { appointment } = this.props.navigation.state.params;
    this.props.walkoutActions.putWalkout(appointment.id, this.state, this.goBack);
  }

  goBack = (result) => {
    if (result) {
      const { loadQueueData } = this.props.navigation.state.params;
      loadQueueData();
      this.props.navigation.goBack();
    }
  }

  handleOnchangeText = otherReason => this.setState({ otherReason }, this.checkCanSave)

  handlePressReason = (option) => {
    const isOtherReasonSelected = option.id === WalkoutReasonsEnum.Other;
    const otherReason = isOtherReasonSelected ? this.state.otherReason : '';
    this.setState({
      removalReasonTypeId: option.id, removalReasonType: option, isOtherReasonSelected, otherReason,
    }, this.checkCanSave);
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })


  checkCanSave = () => {
    const {
      otherReason, provider, isOtherReasonSelected,
    } = this.state;

    let canSave = provider;

    if (isOtherReasonSelected) {
      canSave = otherReason.length > 0;
    }

    this.props.navigation.setParams({ canSave });
  }

  render() {
    return (
      <View style={styles.container}>

        {this.props.walkoutState.isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
  ) : (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={70} enableAutoAutomaticScroll>

      <SectionDivider style={styles.sectionDivider} />
      <InputGroup>
        <ProviderInput
          noLabel
          filterByService
          rootStyle={styles.providerRootStyle}
          selectedProvider={this.state.provider}
          placeholder="Provider"
          navigate={this.props.navigation.navigate}
          headerProps={{ title: 'Providers', ...this.cancelButton() }}
          onChange={this.onChangeProvider}
        />
      </InputGroup>

      <SectionTitle value="WALK-OUT REASON" />
      <InputGroup>
        <InputRadioGroup
          options={walkoutReasons}
          defaultOption={this.state.removalReasonType}
          onPress={this.handlePressReason}
        />
        <InputText
          value={this.state.otherReason}
          isEditable={this.state.isOtherReasonSelected}
          onChangeText={this.handleOnchangeText}
          placeholder="Please specify"
        />
      </InputGroup>
    </KeyboardAwareScrollView>)}
      </View>
    );
  }
}

WalkoutScreen.propTypes = {
  walkoutActions: PropTypes.shape({
    putWalkout: PropTypes.func,
  }).isRequired,
  walkoutState: PropTypes.any.isRequired,
  navigate: PropTypes.any.isRequired,
  formCache: PropTypes.any.isRequired,
  loadQueueData: PropTypes.func.isRequired,
};

export default WalkoutScreen;
