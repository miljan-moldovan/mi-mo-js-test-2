import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import SalonTouchableOpacity
  from '../../../../components/SalonTouchableOpacity';

import clientNotesActions from '../../../../redux/actions/clientNotes';

import {
  InputGroup,
  InputDivider,
  InputSwitch,
  SalonTimePicker,
  SectionDivider,
  SectionTitle,
  InputText,
  ProviderInput,
} from '../../../../components/formHelpers';

import fetchFormCache from '../../../../utilities/fetchFormCache';
import createStyleSheet from './stylesClientNote';
import SalonHeader from '../../../../components/SalonHeader';


interface Props {
  navigation: any;
  clientNotesState: any;
  formCache: any;
  clientNotesActions: any;
  userInfoState: any;
}

interface State {
  styles: any;
  note: {
    id: string
    text: string,
    expiration: string,
    forAppointment: boolean,
    forQueue: boolean,
    forSales: boolean,
    isDeleted: boolean,
    enteredBy: any;
    notes: any;
  },
  forSales: boolean,
  forQueue: boolean,
  forAppointment: boolean,
  datePickerOpen: boolean,
}

class ClientNote extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    const canSave = params.canSave || false;
    const title = params.actionType === 'update' ? 'Edit Note' : 'New Note';

    const styles = createStyleSheet()

    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={
            <SalonTouchableOpacity
              wait={3000}
              onPress={navigation.getParam ('handleGoBack', () => {})}
            >
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              disabled={!canSave}
              wait={3000}
              onPress={navigation.getParam ('handlePress', () => {})}
            >
              <Text
                style={[
                  styles.rightButtonText,
                  {color: canSave ? '#FFFFFF' : '#19428A'},
                ]}
              >
                Save
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      styles: createStyleSheet(),
      note: {
        id: Math.random ().toString (),
        text: '',
        expiration: null,
        forAppointment: false,
        forQueue: false,
        forSales: false,
        isDeleted: false,
        enteredBy: null,
        notes: null
      },
      forSales: false,
      forQueue: false,
      forAppointment: false,
      datePickerOpen: false,
    };

  }


  static compareByDate (a, b) {
    if (a.enterTime < b.enterTime) {
      return 1;
    }
    if (a.enterTime > b.enterTime) {
      return -1;
    }
    return 0;
  }

  componentWillMount () {
    let {note} = this.state;
    const onEditionNote = this.props.navigation.state.params.note;
    const {client} = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'update') {
      note = Object.assign ({}, onEditionNote);

      const provider = {
        fullName: note.enteredBy,
        name: note.enteredBy.split (' ')[0],
        lastName: note.enteredBy.split (' ')[1],
      };
      this.props.clientNotesActions.selectProvider (provider);

      const cachedForm = fetchFormCache (
        'ClientNoteUpdate',
        onEditionNote.id,
        this.props.formCache
      );

      if (onEditionNote.id === cachedForm.id) {
        note = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      const cachedForm = fetchFormCache (
        'ClientNoteNew',
        client.id,
        this.props.formCache
      );

      if (cachedForm) {
        note = cachedForm;
        const selectedProvider = this.props.clientNotesState.selectedProvider
          ? this.props.clientNotesState.selectedProvider
          : {};
        const providerName = !selectedProvider.isFirstAvailable
          ? `${selectedProvider.name || ''} ${selectedProvider.lastName || ''}`
          : 'First Available';

        note.enteredBy = providerName;
      } else {
        this.onChangeProvider(this.props.userInfoState.currentEmployee)
        this.props.clientNotesActions.selectProvider (this.props.userInfoState.currentEmployee);
      }
    }

    this.setState ({
      note,
      forSales: note.forSales,
      forQueue: note.forQueue,
      forAppointment: note.forAppointment,
    });

    this.props.navigation.setParams ({
      handlePress: () => this.saveNote (),
      handleGoBack: () => this.goBack (),
    });
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.navigation.state.params.actionType === 'new') {
      const {client} = this.props.navigation.state.params;
      if (this.shouldSave) {
        this.shouldSave = false;
        this.props.clientNotesActions.setClientNoteNewForm (
          client.id.toString (),
          prevState.note
        );
      }
    } else if (this.shouldSave) {
      this.shouldSave = false;
      this.props.clientNotesActions.setClientNoteUpdateForm (prevState.note);
    }
  }

  onChangeProvider = provider => {
    this.props.clientNotesActions.selectProvider (provider);
    const {note} = this.state;

    const providerName = !provider.isFirstAvailable
      ? `${provider.name || ''} ${provider.lastName || ''}`.toUpperCase ()
      : 'First Available';

    note.enteredBy = providerName;
    this.setState ({note}, this.checkCanSave);
  };

  onChangeText = txtNote => {
    const {note} = this.state;
    note.text = txtNote;
    this.shouldSave = true;
    this.setState ({note}, this.checkCanSave);
  };

  inputDate = selectedDate => {
    const {note} = this.state;
    note.expiration = selectedDate;
    this.shouldSave = true;
    this.setState ({note}, () => {
      this.checkCanSave (true);
    });
  };

  inputSwitchQueue = () => {
    const {note} = this.state;
    note.forQueue = !this.state.forQueue;
    this.shouldSave = true;
    this.setState ({note, forQueue: !this.state.forQueue}, this.checkCanSave);
  };

  inputSwitchAppointment = () => {
    const {note} = this.state;
    note.forAppointment = !this.state.forAppointment;
    this.shouldSave = true;
    this.setState (
      {note, forAppointment: !this.state.forAppointment},
      this.checkCanSave
    );
  };

  inputSwitchSales = () => {
    const {note} = this.state;
    note.forSales = !this.state.forSales;
    this.shouldSave = true;
    this.setState ({note, forSales: !this.state.forSales}, this.checkCanSave);
  };

  handlePressProvider = () => {
    const {navigate} = this.props.navigation;
    const {selectedProvider} = this.props.clientNotesState;
    this.checkCanSave(false)
    this.shouldSave = true;
  };

  cancelButton = () => ({
    leftButton: <Text style={this.state.styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      navigation.goBack ();
    },
    dismissOnSelect: true,
  });

  checkCanSave = (isDate = false) => {
    if (!isDate) {
      this.setState ({datePickerOpen: false});
    }
    let isNoteValid = false;
    if (this.props.navigation.state.params.actionType === 'update') {
      const {text} = this.state.note;
      isNoteValid = text && text.length > 0;
    } else {
      const {note} = this.state;
      isNoteValid =
        note.text &&
        note.text.length > 0 &&
        // note.expiration &&
        note.enteredBy;
    }

    this.props.navigation.setParams ({canSave: isNoteValid});
  };

  pickerToogleBirthday = () => {
    this.setState ({datePickerOpen: !this.state.datePickerOpen});
  };

  saveNote () {
    this.props.navigation.setParams ({canSave: false});
    const {client} = this.props.navigation.state.params;

    const note = Object.assign ({}, this.state.note);
    note.notes = note.text;
    delete note.text;

    if (this.props.navigation.state.params.actionType === 'new') {
      delete note.id;
      delete note.isDeleted;

      this.props.clientNotesActions
        .postClientNotes (client.id, note)
        .then (response => {
          this.props.clientNotesActions.selectProvider (null);
          this.props.navigation.goBack ();
          this.props.navigation.state.params.onNavigateBack ();
        })
        .catch (error => {});
    } else if (this.props.navigation.state.params.actionType === 'update') {
      this.props.clientNotesActions
        .putClientNotes (client.id, note)
        .then (response => {
          this.props.clientNotesActions.selectProvider (null);
          this.props.navigation.goBack ();
          this.props.navigation.state.params.onNavigateBack ();
        })
        .catch (error => {});
    }
  }

  goBack () {
    if (this.props.navigation.state.params.actionType === 'new') {
      const {client} = this.props.navigation.state.params;
      this.props.clientNotesActions.purgeClientNoteNewForm (
        client.id.toString (),
        this.state.note
      );
    } else {
      this.props.clientNotesActions.purgeClientNoteUpdateForm (this.state.note);
    }
    this.props.navigation.goBack ();
  }

  shouldSave = false;

  render () {
    const params = this.props.navigation.state.params || {};
    const {apptBook = false} = params;
    return (
      <View style={this.state.styles.container}>
        {this.props.clientNotesState.isLoading && <LoadingOverlay />}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="never"
          ref="scroll"
          extraHeight={300}
          /*enableAutoAutomaticScroll*/
        >
          <View style={this.state.styles.topSeparator} />
          <InputGroup style={this.state.styles.providerInputGroup}>
            <ProviderInput
              apptBook={apptBook}
              placeholder={false}
              showFirstAvailable={false}
              filterByService
              style={this.state.styles.innerRow}
              selectedProvider={this.props.clientNotesState.selectedProvider}
              label="Added By"
              iconStyle={this.state.styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              onChange={this.onChangeProvider}
              onPress={this.handlePressProvider}
              headerProps={{title: 'Providers', ...this.cancelButton ()}}
            />
          </InputGroup>
          <SectionTitle value="NOTE" style={this.state.styles.sectionTitle} />
          <InputGroup>
            <InputText
              onFocus={() => { this.checkCanSave(false)}}
              placeholder="Write Note"
              onChangeText={this.onChangeText}
              value={this.state.note.text}
              multiline
            />
          </InputGroup>
          <SectionTitle value="TYPES" style={this.state.styles.sectionTitle} />
          <InputGroup>
            <InputSwitch
              style={this.state.styles.inputSwitchSales}
              textStyle={this.state.styles.inputSwitchTextStyle}
              onChange={this.inputSwitchSales}
              value={this.state.forSales}
              text="Sales"
            />
            <InputDivider />
            <InputSwitch
              style={this.state.styles.inputSwitchAppointment}
              textStyle={this.state.styles.inputSwitchTextStyle}
              onChange={this.inputSwitchAppointment}
              value={this.state.forAppointment}
              text="Appointment"
            />
            <InputDivider />
            <InputSwitch
              style={this.state.styles.inputSwitchQueue}
              textStyle={this.state.styles.inputSwitchTextStyle}
              onChange={this.inputSwitchQueue}
              value={this.state.forQueue}
              text="Queue"
            />
          </InputGroup>
          <SectionDivider style={this.state.styles.sectionDivider} />

          <InputGroup>

            <SalonTimePicker
              minimumDate={moment ().toDate ()}
              format="MM-DD-YYYY"
              label="Expire Date"
              mode="date"
              placeholder="Optional"
              noIcon
              value={this.state.note.expiration}
              isOpen={this.state.datePickerOpen}
              onChange={this.inputDate}
              toggle={this.pickerToogleBirthday}
              valueStyle={
                this.state.note.expiration == null ? this.state.styles.valueStyleDate : {}
              }
            />

          </InputGroup>
        </KeyboardAwareScrollView>

      </View>
    );
  }
}


const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators ({...clientNotesActions as any}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ClientNote);
