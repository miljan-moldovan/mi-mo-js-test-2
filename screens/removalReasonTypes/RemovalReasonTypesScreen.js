import React from 'react';
import {
  View,
  Text,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import LoadingOverlay from '../../components/LoadingOverlay';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputRadioGroup,
  InputGroup,
  SectionDivider,
  SectionTitle,
  ProviderInput,
  InputText,
} from '../../components/formHelpers';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';


class RemovalReasonTypesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params &&
      navigation.state.params.handlePress
      ? navigation.state.params.handlePress
      : () => { };
    const { name, lastName } = navigation.state.params.appointment.client;

    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const title = params.type === 'noshow' ? 'No Show' : 'Walk-out';

    return {
      header: (
        <SalonHeader
          title={title}
          subTitle={`${name} ${lastName}`}
          headerLeft={(
            <SalonTouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()}>
              <Text style={{
                fontSize: 14, color: 'white',
              }}
              >Back
              </Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity
              wait={3000}
              onPress={handlePress}
              disabled={!canSave}
              style={styles.rightButtonContainer}
            >
              <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      removalReasonTypeId: null,
      isOtherReasonSelected: true,
      otherReason: '',
      employeeId: 0,
      provider: null,
      removalReasonType: null,
    };

    this.props.navigation.setParams({ handlePress: this.handleDone });

    props.removalReasonTypesActions.getRemovalReasonTypes(this.finishedRemovalReasonTypes);
  }


  componentWillMount() {
    const { appointment } = this.props.navigation.state.params;
    const service = appointment.services[0];
    // const provider = service.isFirstAvailable ?
    //  null : service.employee;
    const provider = null;

    this.setState({ provider, employeeId: provider ? provider.id : null });
  }


  handleDone = () => {
    const { type } = this.props.navigation.state.params;
    if (type === 'noshow') {
      this.showAlertNoShow();
    } else {
      this.showAlertWalkOut();
    }
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })


  showAlertNoShow = () => {
    const { appointment } = this.props.navigation.state.params;
    const { client } = appointment;

    const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;

    Alert.alert(
      'No show',
      `Are you sure you want to mark ${fullName} as a no show?`,
      [
        { text: 'No, cancel', onPress: () => { }, style: 'cancel' },
        {
          text: 'Yes, I’m sure',
          onPress: () => {
            this.handleNoShow();
          },
        },
      ],
      { cancelable: false },
    );
  }

  handleNoShow = () => {
    const { appointment, noShow } = this.props.navigation.state.params;

    const params = JSON.parse(JSON.stringify(this.state));
    params.removalReasonTypeId = params.isOtherReasonSelected ? null : params.removalReasonTypeId;
    delete params.provider;
    delete params.removalReasonType;

    noShow(appointment.id, params, this.goBack);
  }

  goBack = (result) => {
    if (result) {
      const { loadQueueData } = this.props.navigation.state.params;
      loadQueueData();
      this.props.navigation.goBack();
    }
  }

  showAlertWalkOut = () => {
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
    const { appointment, walkOut } = this.props.navigation.state.params;

    const params = JSON.parse(JSON.stringify(this.state));
    params.removalReasonTypeId = params.isOtherReasonSelected ? null : params.removalReasonTypeId;
    delete params.provider;
    delete params.removalReasonType;


    walkOut(appointment.id, params, this.goBack);
  }

  onChangeProvider = (provider) => {
    this.setState({ provider, employeeId: provider.id }, this.checkCanSave);
  }

  finishedRemovalReasonTypes = (result) => {
    this.props.removalReasonTypesState.removalReasonTypes.push({ id: null, name: 'Other' });
    const selectedRemovalReasonTypes = this.props.removalReasonTypesState.removalReasonTypes[this.props.removalReasonTypesState.removalReasonTypes.length - 1];
    this.setState({
      removalReasonType: selectedRemovalReasonTypes,
    });
  }

  handleOnchangeText = otherReason => this.setState({ otherReason }, this.checkCanSave)

  handlePressReason = (option) => {
    const isOtherReasonSelected = option.id === null;
    const otherReason = isOtherReasonSelected ? this.state.otherReason : '';
    this.setState({
      removalReasonTypeId: option.id, removalReasonType: option, isOtherReasonSelected, otherReason,
    }, this.checkCanSave);
  }

  checkCanSave = () => {
    const {
      otherReason, provider, isOtherReasonSelected,
    } = this.state;
    let canSave = !!provider;

    if (isOtherReasonSelected) {
      canSave = canSave && otherReason.length > 0;
    }

    this.props.navigation.setParams({ canSave });
  }

  render() {
    const { type } = this.props.navigation.state.params;
    const title = type === 'noshow' ? 'NO SHOW REASON' : 'WALK-OUT REASON';

    return (
      <View style={styles.container}>
        {this.props.loading &&
          <LoadingOverlay />
        }
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={80} enableAutoAutomaticScroll>
          <SectionDivider style={styles.sectionDivider} />
          <InputGroup>
            <ProviderInput
              label="Select Receptionist"
              showFirstAvailable={false}
              filterByService
              mode="receptionists"
              rootStyle={styles.providerRootStyle}
              selectedProvider={this.state.provider}
              placeholder={false}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={this.onChangeProvider}
            />
          </InputGroup>

          <SectionTitle value={title} />
          <InputGroup>

            <React.Fragment>
              <InputRadioGroup
                options={this.props.removalReasonTypesState.removalReasonTypes}
                defaultOption={this.state.removalReasonType}
                onPress={this.handlePressReason}
              />
              <InputText
                value={this.state.otherReason}
                isEditable={this.state.isOtherReasonSelected}
                onChangeText={this.handleOnchangeText}
                placeholder="Please specify"
              />
            </React.Fragment>
          </InputGroup>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


RemovalReasonTypesScreen.defaultProps = {

};

RemovalReasonTypesScreen.propTypes = {
  removalReasonTypesActions: PropTypes.shape({
    getRemovalReasonTypes: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  removalReasonTypesState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default RemovalReasonTypesScreen;
