import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';

import reasonTypeModel from '../../../utilities/models/reasonType';
import fetchFormCache from '../../../utilities/fetchFormCache';
import SalonAvatar from '../../../components/SalonAvatar';
import apiWrapper from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import {
  InputDivider,
} from '../../../components/formHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingTop: 18,
  },
  titleRow: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
    marginLeft: 10,
  },
  rowRightContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#727A8F',
    marginRight: 8,
  },
  label: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 12,
  },
  textData: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
  },
  checkIcon: {
    color: '#1DBF12',
    fontSize: 14,
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
    paddingRight: 16,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  textInput: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
    marginBottom: 9,
    height: 44,
  },
  headerButton: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#19428A',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

class WalkoutScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params && navigation.state.params.walkout ? navigation.state.params.walkout : () => {};
    const { name, lastName } = navigation.state.params.appointment.client;

    return {
      headerTitle: <View style={styles.titleContainer}>
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
          >
            <Text style={styles.rightButtonText}>Done</Text>
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
    };
  }

  componentWillMount() {
    this.props.walkoutActions.getRemovalReasonTypes();
    const { id } = this.props.navigation.state.params.appointment;
    const service = this.props.navigation.state.params.appointment.services[0];
    const employeeId = service.employeeId;

    const cachedForm = fetchFormCache('WalkoutScreen', id.toString(), this.props.formCache);
    if (id === cachedForm.id) {
      this.setState({ ...cachedForm });
    } else {
      this.setState({ id, employeeId });
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkout: () => {
        const { removalReasonTypeId } = this.state;
        if (removalReasonTypeId > -1) {
          this.handleWalkout();
          navigation.goBack();
        }
      },
    });
  }

  handlePressReason = (removalReasonTypeId, isOtherReasonSelected) => {
    this.setState({ removalReasonTypeId, isOtherReasonSelected });
  }

  handleWalkout = () => {
    const { id } = this.state;
    this.props.walkoutActions.putWalkout(id, this.state);
  }

  handleOnchangeText = otherReason => this.setState({ otherReason })

  renderCheck = (reason) => {
    if (reason === this.state.removalReasonTypeId) {
      return (
        <View style={styles.rowRightContainer}>
          <FontAwesome style={styles.checkIcon}>{Icons.checkCircle}</FontAwesome>
        </View>
      );
    }
    return null;
  }

  onChangeProvider = (provider) => {
    this.props.appointmentNotesActions.selectProvider(provider);
    const note = this.state.note;
    note.author = `${provider.name} ${provider.lastName}`;
    this.setState({ note, isVisible: true });
  }

  handlePressProvider = () => {
    const { navigate } = this.props.navigation;

    navigate('Providers', {
      actionType: 'new',
      dismissOnSelect: this.dismissOnSelect,
      onChangeProvider: this.onChangeProvider,
      ...this.props,
    });
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('AppointmentNoteScreen');
  }

  render() {
    const { appointment } = this.props.navigation.state.params;
    const service = appointment.services[0];

    const fullName = !service.isFirstAvailable ? `${service.employeeFirstName} ${service.employeeLastName}` : 'First Available';

    return (
      <View style={styles.container}>
        <SalonTouchableOpacity onPress={this.handlePressProvider}>
          <View style={[styles.row, styles.borderTop, {
    borderBottomWidth: 1,
              borderColor: '#C0C1C6',
}]}
          >
            <Text style={styles.label}>Provider</Text>
            <View style={styles.rowRightContainer}>
              <SalonAvatar
                wrapperStyle={styles.providerRound}
                width={30}
                borderWidth={1}
                borderColor="transparent"
                image={{ uri: apiWrapper.getEmployeePhoto(!service.isFirstAvailable ? service.employeeId : 0) }}
              />
              <Text style={styles.textData}>{fullName}</Text>
              <FontAwesome style={styles.carretIcon}>{Icons.angleRight}</FontAwesome>
            </View>
          </View>
        </SalonTouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>WALK-OUT REASON</Text>
        </View>
        <SalonTouchableOpacity onPress={() => this.handlePressReason(1, false)}>
          <View style={[styles.row, styles.borderTop]}>
            <Text>Waited too much</Text>
            {this.renderCheck(1)}
          </View>
        </SalonTouchableOpacity>
        <View style={{ width: '100%', backgroundColor: '#FFFFFF' }} ><InputDivider style={{ marginHorizontal: 16 }} /></View>
        <SalonTouchableOpacity onPress={() => this.handlePressReason(2, false)}>
          <View style={styles.row}>
            <Text>Personal Affairs</Text>
            {this.renderCheck(2)}
          </View>
        </SalonTouchableOpacity>
        <View style={{ width: '100%', backgroundColor: '#FFFFFF' }} ><InputDivider style={{ marginHorizontal: 16 }} /></View>
        <SalonTouchableOpacity onPress={() => this.handlePressReason(3, false)}>
          <View style={styles.row}>
            <Text>Provider didn&#39;t show up</Text>
            {this.renderCheck(3)}
          </View>
        </SalonTouchableOpacity>
        <View style={{ width: '100%', backgroundColor: '#FFFFFF' }} ><InputDivider style={{ marginHorizontal: 16 }} /></View>
        <SalonTouchableOpacity onPress={() => this.handlePressReason(0, true)}>
          <View style={styles.textAreaContainer}>
            <View style={styles.innerRow}>
              <Text>Other</Text>
              {this.renderCheck(0)}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Please specify"
              placeholderTextColor="#C0C1C6"
              multiline
              editable={this.state.isOtherReasonSelected}
              value={this.state.otherReason}
              onChangeText={this.handleOnchangeText}
            />
          </View>
        </SalonTouchableOpacity>
      </View>
    );
  }
}

WalkoutScreen.propTypes = {
  walkoutActions: PropTypes.shape({
    getRemovalReasonTypes: PropTypes.func,
    putWalkout: PropTypes.func,
  }).isRequired,
  reasonTypes: PropTypes.arrayOf(PropTypes.shape(reasonTypeModel)).isRequired,
};

export default WalkoutScreen;
