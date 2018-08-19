import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
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
import styles from './styles';

class BlockTimeScreen extends React.Component {
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
      bookedByEmployee,
    } = params;

    this.state.fromTime = fromTime;
    this.state.toTime = moment(fromTime, 'hh:mm:ss A').add(15, 'minutes');
    this.state.provider = employee;
    this.state.selectedDate = date;
    this.state.blockedBy = bookedByEmployee;
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


  componentWillMount() {
    const params = this.props.navigation.state.params || {};
    const date = params.date || moment();
    this.state.selectedDate = date;
  }

  onChangeBlockBy = (provider) => { this.handleBlockedBySelection(provider); }

  onPressDate = (selectedDate) => {
    this.setState({ selectedDate }, this.checkCanSave);
  }

  onChangeTextComments =(txtNote) => {
    this.setState({ comments: txtNote });
  }

  onChangeBlockTimeReason = (blockTimesReason) => {
    this.handleBlockTimesReasonSelection(blockTimesReason);
  }

  onChangeEmployee = (provider) => { this.handleProviderSelection(provider); };;


    handleChangefromTime = (fromTimeDateObj) => {
      const { toTime } = this.state;
      const fromTime = moment(fromTimeDateObj);
      if (fromTime.isAfter(toTime)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        fromTime,
      }, this.checkCanSave);
    }

    handleChangetoTime = (toTimeDateObj) => {
      const { fromTime } = this.state;
      const toTime = moment(toTimeDateObj);
      if (fromTime.isAfter(toTime)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        toTime,
      }, this.checkCanSave);
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
      }, this.checkCanSave);
    }

    handleBlockedBySelection = (blockedBy) => {
      this.setState({
        blockedBy,
      }, this.checkCanSave);
    }

    handleBlockTimesReasonSelection = (blockTimesReason) => {
      const duration = moment.duration(blockTimesReason.defaultDuration);
      const { fromTime } = this.state;
      const toTime = moment(fromTime, 'hh:mm:ss A').add(duration);

      this.setState({
        blockTimesReason, toTime,
      }, this.checkCanSave);
    }


    tooglefromTime = () => {
      this.setState({ fromTimePickerOpen: !this.state.fromTimePickerOpen });
    }

    toogletoTime = () => {
      this.setState({ toTimePickerOpen: !this.state.toTimePickerOpen });
    }


      handleDone = () => {
        const schedule = {
          date: this.state.selectedDate,
          fromTime: this.state.fromTime.format('HH:mm:ss'),
          toTime: this.state.toTime.format('HH:mm:ss'),
          notes: this.state.comments.length > 0 ? this.state.comments : null,
          reasonId: this.state.blockTimesReason.id,
          employeeId: this.state.provider.id,
          bookedByEmployeeId: this.state.blockedBy.id,
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

      checkCanSave = () => {
        const {
          selectedDate, fromTime, toTime,
          blockTimesReason, provider, blockedBy,
        } = this.state;

        const canSave = selectedDate &&
        fromTime &&
        toTime &&
        blockTimesReason &&
        provider &&
        blockedBy;

        this.props.navigation.setParams({ canSave });
      }

      render() {
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
              showFirstAvailable={false}
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


BlockTimeScreen.defaultProps = {

};

BlockTimeScreen.propTypes = {
  blockTimeActions: PropTypes.shape({
    postBlockTime: PropTypes.func.isRequired,
  }).isRequired,
  appointmentCalendarActions: PropTypes.shape({
    setGridView: PropTypes.func.isRequired,
  }).isRequired,
  blockTimeState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default BlockTimeScreen;
