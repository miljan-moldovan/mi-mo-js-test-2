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
  sectionDivider: { height: 37 },
  inputGroup: { marginTop: 16 },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { fontSize: 14, color: 'white' },
  leftButtonText: { fontSize: 14, color: 'white' },
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
});


export default class BlockTimeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;

    return {
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
          Block Time
          </Text>
        </View>
      ),

      headerLeft: (
        <SalonTouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.leftButtonText}>Cancel</Text>
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


    this.props.blockTimeActions.postBlockTime(schedule, (result, error) => {
      if (result) {
        this.props.appointmentCalendarActions.setGridView();
        this.props.navigation.goBack();
      } else {
        alert(error.message);
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
      leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
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
      const duration = moment.duration(blockTimesReason.defaultDuration);
      const { fromTime } = this.state;
      const toTime = moment(fromTime, 'hh:mm:ss A').add(duration);

      this.setState({
        blockTimesReason, toTime,
      });
      this.props.navigation.setParams({ canSave: true });
    }


    tooglefromTime = () => {
      this.setState({ fromTimePickerOpen: !this.state.fromTimePickerOpen });
    }

    toogletoTime = () => {
      this.setState({ toTimePickerOpen: !this.state.toTimePickerOpen });
    }

    onChangeTextComments =(txtNote) => {
      this.setState({ comments: txtNote });
    }

    onChangeBlockTimeReason = (blockTimesReason) => {
      this.handleBlockTimesReasonSelection(blockTimesReason);
    }

    onChangeEmployee = (provider) => { this.handleProviderSelection(provider); };;

    onPressDate = (selectedDate) => {
      this.setState({ selectedDate });
    }
    onChangeBlockBy = (provider) => { this.handleBlockedBySelection(provider); }

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
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
      ) : (

        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
          <InputGroup style={styles.inputGroup}>
            <ProviderInput
              apptBook
              noPlaceholder
              filterByService
              style={styles.innerRow}
              selectedProvider={blockedBy}
              label="Blocked By"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={this.onChangeBlockBy}
            />
            <InputDivider />
            <InputDate
              noIcon
              style={{ flex: 1 }}
              placeholder="Date"
              onPress={this.onPressDate}
              selectedDate={this.state.selectedDate ? this.state.selectedDate : false}
            />
          </InputGroup>

          <SectionDivider style={styles.sectionDivider} />
          <InputGroup>
            <ProviderInput
              apptBook
              noPlaceholder
              filterByService
              style={styles.innerRow}
              selectedProvider={provider}
              label="Employee"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={this.onChangeEmployee}
            />
          </InputGroup>


          <SectionDivider style={styles.sectionDivider} />
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
              headerProps={{ title: 'Reason', ...this.cancelButton() }}
              onChange={this.onChangeBlockTimeReason}
            />
          </InputGroup>

          <SectionDivider style={styles.sectionDivider} />
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
          <SectionDivider style={styles.sectionDivider} />
          <InputGroup>
            <Text style={[styles.sectionTitle]}>Comments</Text>
            <InputText
              placeholder="Please insert here your comments"
              onChangeText={this.onChangeTextComments}
              value={this.state.comments}
            />
          </InputGroup>

        </KeyboardAwareScrollView>)}
        </View>
      );
    }
}
