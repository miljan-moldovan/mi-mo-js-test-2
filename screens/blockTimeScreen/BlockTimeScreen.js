import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { get } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputDate,
  InputGroup,
  InputDivider,
  ProviderInput,
  SectionDivider,
  BlockTimesReasonInput,
  InputText,
} from '../../components/formHelpers';
import SalonTimePicker from '../../components/formHelpers/components/SalonTimePicker';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  innerRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
  },
  contentStyle: { alignItems: 'flex-start', paddingLeft: 16 },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto',
    marginLeft: 0,
    marginTop: 7,
  },
  rightButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});


const scheduleTypes = [
  { id: 1, name: 'Regular' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Vacation' },
  { id: 4, name: 'OutSick' },
  { id: 0, name: 'Other' },
];

export default class BlockTimeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = false; // params.canSave || false;
    const employee = params.employee || { name: 'First', lastName: 'Available' };

    return {
      headerTitle: (
        <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
        >
          <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 17,
          lineHeight: 22,
          color: 'white',
        }}
          >
          Block Time
          </Text>
        </View>
      ),

      headerLeft: (
        <SalonTouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => {
          if (navigation.state.params.handleDone) {
            navigation.state.params.handleDone();
          }
        }}
        >
          <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ handleDone: this.handleDone });

    const params = this.props.navigation.state.params || {};

    const {
      fromTime,
      employee,
      date,
    } = params;

    this.state.fromTime = fromTime;
    this.state.toTime = moment(fromTime, 'hh:mm:ss A').add(15, 'minutes');
    this.state.provider = employee;
    this.state.selectedDate = date;
  }

  state = {
    fromTime: null,
    fromTimePickerOpen: false,
    toTime: null,
    toTimePickerOpen: false,
    selectedDate: moment(),
    provider: null,
    blockedBy: null,
    blockTimesReason: null,
    comments: '',
  }

  handleDone = () => {
    const schedule = {
      date: this.state.date.toISOString(),
      fromTime: this.state.fromTime.format('HH:mm:ss'),
      toTime: this.state.toTime.format('HH:mm:ss'),
      notes: this.state.comments.length > 0 ? this.state.comments : null,
      reasonId: this.state.blockTimesReason.id,
      employeeId: this.state.provider.id,
      bookedByEmployeeId: this.state.blockedBy.id,
      //   id: 0,
      updateStamp: moment().unix(),
      isDeleted: false,
    };


    this.props.blockTimeActions.postBlockTime(schedule, (result) => {
      if (result) {
        this.props.appointmentCalendarActions.setGridView();
        this.props.navigation.goBack();
      }
    });
  }

  componentWillMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    const date = params.date || moment();
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.state.date = date;
  }


    handleChangefromTime = (fromTimeDateObj) => {
      const { toTime } = this.state;
      const fromTime = moment(fromTimeDateObj);
      if (fromTime.isAfter(toTime)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        fromTime,
      });
    }

    handleChangetoTime = (toTimeDateObj) => {
      const { fromTime } = this.state;
      const toTime = moment(toTimeDateObj);
      if (fromTime.isAfter(toTime)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        toTime,
      });
    }

    cancelButton = () => ({
      leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
      leftButtonOnPress: (navigation) => {
        navigation.goBack();
      },
    })


    handleProviderSelection = (provider) => {
      this.setState({
        provider,
      });
    }

    handleBlockedBySelection = (blockedBy) => {
      this.setState({
        blockedBy,
      });
      this.props.navigation.setParams({ canSave: true });
    }

    handleBlockTimesReasonSelection = (blockTimesReason) => {
      this.setState({
        blockTimesReason,
      });
      this.props.navigation.setParams({ canSave: true });
    }


    tooglefromTime = () => {
      this.setState({ fromTimePickerOpen: !this.state.fromTimePickerOpen });
    }

    toogletoTime = () => {
      this.setState({ toTimePickerOpen: !this.state.toTimePickerOpen });
    }

    render() {
      const {
        blockTimeState,
      } = this.props;


      const {
        fromTime,
        toTime,
        provider,
        blockedBy,
        blockTimesReason,
      } = this.state;

      return (
        <View style={styles.container}>

          {this.props.blockTimeState.isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
      ) : (

        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
          <InputGroup style={{ marginTop: 16 }}>
            <ProviderInput
              apptBook
              noPlaceholder
              filterByService
              style={styles.innerRow}
              selectedProvider={blockedBy}
              labelText="Blocked By"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={(provider) => { this.handleBlockedBySelection(provider); }}
            />
            <InputDivider />
            <InputDate
              noIcon
              style={{ flex: 1 }}
              placeholder="Date"
              onPress={(selectedDate) => {
              this.setState({ selectedDate });
            }}
              selectedDate={this.state.selectedDate ? this.state.selectedDate : false}
            />
          </InputGroup>

          <SectionDivider style={{ height: 37 }} />
          <InputGroup>
            <ProviderInput
              apptBook
              noPlaceholder
              filterByService
              style={styles.innerRow}
              selectedProvider={provider}
              labelText="Employee"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={(provider) => { this.handleProviderSelection(provider); }}
            />
          </InputGroup>


          <SectionDivider style={{ height: 37 }} />
          <InputGroup>
            <BlockTimesReasonInput
              apptBook
              noPlaceholder
              style={styles.innerRow}
              selectedBlockTimesReason={blockTimesReason}
              labelText="Reason"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={(blockTimesReason) => { this.handleBlockTimesReasonSelection(blockTimesReason); }}
            />
          </InputGroup>

          <SectionDivider style={{ height: 37 }} />
          <InputGroup>
            <SalonTimePicker
              label="Start"
              noIcon
              value={fromTime}
              isOpen={this.state.fromTimePickerOpen}
              onChange={this.handleChangefromTime}
              toggle={this.tooglefromTime}
            />
            <InputDivider />
            <SalonTimePicker
              label="Ends"
              noIcon
              value={toTime}
              isOpen={this.state.toTimePickerOpen}
              onChange={this.handleChangetoTime}
              toggle={this.toogletoTime}
            />
          </InputGroup>
          <SectionDivider style={{ height: 37 }} />
          <InputGroup>
            <Text style={[styles.sectionTitle]}>Comments</Text>
            <InputText
              placeholder="Please insert here your comments"
              onChangeText={(txtNote) => {
                this.setState({ comments: txtNote });
              }}
              value={this.state.comments}
            />
          </InputGroup>

        </KeyboardAwareScrollView>)}
        </View>
      );
    }
}
