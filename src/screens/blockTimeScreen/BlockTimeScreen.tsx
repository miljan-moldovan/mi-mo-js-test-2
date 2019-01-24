import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputGroup,
  InputDivider,
  ProviderInput,
  SectionDivider,
  BlockTimesReasonInput,
  InputText,
} from '../../components/formHelpers';
import SalonTimePicker from '../../components/formHelpers/components/SalonTimePicker';
import SchedulePicker from '../../components/formHelpers/components/SchedulePicker';

import DateTimes from '../../constants/DateTime';
import EditTypes from '../../constants/EditTypes';
import styles from './styles';
import SalonHeader from '../../components/SalonHeader';
import { ScheduleBlocks } from '../../utilities/apiWrapper';
import { checkRestrictionsCancelBlockTime, checkRestrictionsModifyBlockTime } from '@/redux/actions/restrictions';
import { connect } from 'react-redux';
import { Tasks } from '@/constants/Tasks';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';

class BlockTimeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canCancel = !navigation.state.params.cancelIsDisabled || !navigation.state.params.cancelIsLoading;
    const canSave = params.canSave || !navigation.state.params.doneIsDisabled
      || !navigation.state.params.doneIsLoading || false;

    return {
      header: (
        <SalonHeader
          title="Block Time"
          headerLeft={
            <SalonTouchableOpacity
              disabled={!canCancel}
              onPress={() => {
                if (navigation.state.params.handleCancel) {
                  return navigation.state.params.handleCancel();
                }
                navigation.goBack();
              }}
            >
              {navigation.state.params.cancelIsLoading ?
                (
                  <View style={styles.leftButtonText}>
                    <ActivityIndicator />
                  </View>
                )
                :
                <Text style={styles.leftButtonText}>Cancel</Text>}
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              disabled={!canSave}
              onPress={() => {
                if (navigation.state.params.handleDone) {
                  navigation.state.params.handleDone();
                }
              }}
            >
              {navigation.state.params.doneIsLoading ?
                (
                  <View style={styles.rightButtonText}>
                    <ActivityIndicator />
                  </View>
                )
                :
                <Text
                  style={[
                    styles.rightButtonText,
                    { color: canSave ? '#FFFFFF' : '#19428A' },
                  ]}
                >
                  Done
                </Text>}
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ handleDone: this.handleDone });
    this.props.navigation.setParams({ handleCancel: this.handleCancel });
    this.props.navigation.setParams({ cancelIsDisabled: this.props.cancelIsDisabled });
    this.props.navigation.setParams({ cancelIsLoading: this.props.cancelIsLoading });
    this.props.navigation.setParams({ doneIsDisabled: this.props.donelIsDisabled });
    this.props.navigation.setParams({ donelIsLoading: this.props.donelIsLoading });

    const params = this.props.navigation.state.params || {};

    const {
      fromTime,
      employee,
      date,
      bookedByEmployee,
      reason,
      toTime,
      id,
      notes,
      editType,
    } = params;

    let toTimeVal = toTime
      ? moment(toTime, 'hh:mm:ss A')
      : moment(fromTime, 'hh:mm:ss A').add(
        this.props.apptGridSettings.step,
        'minutes',
      );

    this.state = {
      editType: editType || EditTypes.new,
      fromTime: moment(fromTime, 'hh:mm:ss A'),
      toTime: toTimeVal,
      fromTimePickerOpen: false,
      toTimePickerOpen: false,
      provider: employee,
      selectedDate: date,
      blockedBy: bookedByEmployee,
      id: id || -1,
      blockTimesReason: reason || null,
      isOpenDatePicker: false,
      comments: notes || '',
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.cancelIsDisabled !== newProps.cancelIsDisabled
      || this.props.cancelIsLoading !== newProps.cancelIsLoading) {
      this.props.navigation.setParams({ cancelIsDisabled: newProps.cancelIsDisabled });
      this.props.navigation.setParams({ cancelIsLoading: newProps.cancelIsLoading });
    }
    if (this.props.doneIsDisabled !== newProps.doneIsDisabled
      || this.props.doneIsLoading !== newProps.doneIsLoading) {
      this.props.navigation.setParams({ cancelIsDisabled: newProps.doneIsDisabled });
      this.props.navigation.setParams({ cancelIsLoading: newProps.doneIsLoading });
    }
  }

  // componentWillMount () {
  //   const params = this.props.navigation.state.params || {};
  //   const date = params.date || moment ();
  //   this.state.selectedDate = date;
  // }

  onChangeBlockBy = provider => {
    this.handleBlockedBySelection(provider);
  };

  onChangeDate = selectedDate => {
    this.setState({ selectedDate }, this.checkCanSave);
  };

  onChangeTextComments = txtNote => {
    this.setState({ comments: txtNote }, this.checkCanSave);
  };

  onChangeBlockTimeReason = blockTimesReason => {
    this.handleBlockTimesReasonSelection(blockTimesReason);
  };

  onChangeEmployee = provider => {
    this.handleProviderSelection(provider);
  };

  handleChangefromTime = fromTimeDateObj => {
    const { toTime } = this.state;
    const fromTime = moment(fromTimeDateObj);
    if (fromTime.isAfter(toTime)) {
      return alert('Start time can\'t be after end time');
    }
    return this.setState(
      {
        fromTime,
      },
      this.checkCanSave,
    );
  };

  toggleDatePicker = () =>
    this.setState({ isOpenDatePicker: !this.state.isOpenDatePicker });

  handleChangetoTime = toTimeDateObj => {
    const { fromTime } = this.state;
    const toTime = moment(toTimeDateObj);
    if (fromTime.isAfter(toTime)) {
      return alert('Start time can\'t be after end time');
    }
    return this.setState(
      {
        toTime,
      },
      this.checkCanSave,
    );
  };

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      navigation.goBack();
    },
  });

  handleProviderSelection = provider => {
    this.setState(
      {
        provider,
      },
      this.checkCanSave,
    );
  };

  handleBlockedBySelection = blockedBy => {
    this.setState(
      {
        blockedBy,
      },
      this.checkCanSave,
    );
  };

  handleBlockTimesReasonSelection = blockTimesReason => {
    const duration = moment.duration(blockTimesReason.defaultDuration);
    const { fromTime } = this.state;
    const toTime = moment(fromTime, 'hh:mm:ss A').add(duration);

    this.setState(
      {
        blockTimesReason,
        toTime,
      },
      this.checkCanSave,
    );
  };

  tooglefromTime = () => {
    this.setState(
      { fromTimePickerOpen: !this.state.fromTimePickerOpen },
      this.checkCanSave,
    );
  };

  toogletoTime = () => {
    this.setState(
      { toTimePickerOpen: !this.state.toTimePickerOpen },
      this.checkCanSave,
    );
  };

  saveBlockTime = () => {
    const schedule = {
      date: moment(this.state.selectedDate).format(DateTimes.serverDateTime),
      fromTime: this.state.fromTime.format('HH:mm:ss'),
      toTime: this.state.toTime.format('HH:mm:ss'),
      notes: this.state.comments.length > 0 ? this.state.comments : null,
      reasonId: this.state.blockTimesReason.id,
      employeeId: this.state.provider.id,
      bookedByEmployeeId: this.state.blockedBy.id,
      updateStamp: moment().unix(),
      isDeleted: false,
    };

    if (this.state.editType === EditTypes.new) {
      this.props.blockTimeActions.postBlockTime(schedule, (result, error) => {
        if (result) {
          this.props.appointmentCalendarActions.setGridView();
          this.props.navigation.goBack();
        }
      });
    } else {
      this.props.blockTimeActions.putBlockTimeEdit(
        this.state.id,
        schedule,
        (result, error) => {
          if (result) {
            this.props.appointmentCalendarActions.setGridView();
            this.props.navigation.goBack();
          }
        },
      );
    }
  };

  handleCancel = () => {
    this.props.checkRestrictionsCancelBlockTime(() => this.props.navigation.goBack());
  };

  handleDone = () => {
    this.props.checkRestrictionsModifyBlockTime(
      () => {
        let conflictData = {
          date: moment(this.state.selectedDate).format(DateTimes.serverDateTime),
          fromTime: this.state.fromTime.format('HH:mm:ss'),
          toTime: this.state.toTime.format('HH:mm:ss'),
          employeeId: this.state.provider.id,
          blockTypeId: this.state.blockTimesReason.id,
        };
        if (this.state.id > 0) {
          conflictData = {
            ...conflictData,
            scheduleBlockId: this.state.id,
          };
        } else {
          conflictData = {
            ...conflictData,
            bookedByEmployeeId: this.state.blockedBy.id,
          };
        }

        ScheduleBlocks.postCheckConflictsBlocks(conflictData)
          .then(conflicts => {
            if (conflicts && conflicts.length) {
              const navParams = {
                date: conflictData.date,
                startTime: conflictData.fromTime,
                endTime: conflictData.toTime,
                conflicts,
                handleDone: this.saveBlockTime,
                headerProps: {
                  btnRightText: 'Save anyway',
                },
              };
              this.props.navigation.navigate('Conflicts', navParams);
            } else {
              this.saveBlockTime();
            }
          })
          .catch(error => console.log('Error', error));
      });
  };


  checkCanSave = () => {
    const {
      selectedDate,
      fromTime,
      toTime,
      blockTimesReason,
      provider,
      blockedBy,
    } = this.state;

    const canSave =
      selectedDate &&
      fromTime &&
      toTime &&
      blockTimesReason &&
      provider &&
      blockedBy;

    this.props.navigation.setParams({ canSave });
  };

  render() {
    const {
      fromTime,
      toTime,
      provider,
      blockedBy,
      blockTimesReason,
      selectedDate,
      isOpenDatePicker,
    } = this.state;

    return (
      <View style={styles.container}>

        {this.props.blockTimeState.isLoading
          ? <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
          : <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            ref="scroll"
            extraHeight={300}
          >
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
              <SalonTimePicker
                mode="date"
                label="Date"
                format="ddd, MM/DD/YYYY"
                value={selectedDate}
                isOpen={isOpenDatePicker}
                toggle={this.toggleDatePicker}
                onChange={this.onChangeDate}
                minimumDate={moment().toDate()}
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
              <SchedulePicker
                date={selectedDate}
                label="Start"
                icon={false}
                format="hh:mm A"
                value={fromTime}
                isOpen={this.state.fromTimePickerOpen}
                onChange={this.handleChangefromTime}
                toggle={this.tooglefromTime}
              />
              <InputDivider />
              <SchedulePicker
                date={selectedDate}
                label="Ends"
                icon={false}
                format="hh:mm A"
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

          </KeyboardAwareScrollView>}
      </View>
    );
  }
}

BlockTimeScreen.defaultProps = {
  editType: EditTypes.new,
};

BlockTimeScreen.propTypes = {
  blockTimeActions: PropTypes.shape({
    postBlockTime: PropTypes.func.isRequired,
    putBlockTimeEdit: PropTypes.func.isRequired,
  }).isRequired,
  appointmentCalendarActions: PropTypes.shape({
    setGridView: PropTypes.func.isRequired,
  }).isRequired,
  blockTimeState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

const mapActionsToProps = dispatch => ({
  checkRestrictionsCancelBlockTime: (callback) => dispatch(checkRestrictionsCancelBlockTime(callback)),
  checkRestrictionsModifyBlockTime: (callback) => dispatch(checkRestrictionsModifyBlockTime(callback)),
});

const mapStateToProps = state => ({
  cancelIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_CancelBlock),
  cancelIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_CancelBlock),
  doneIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_ModifyBlock),
  doneIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_ModifyBlock),
});

export default connect(mapStateToProps, mapActionsToProps)(BlockTimeScreen);
