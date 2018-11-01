import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';

import clientNotesActions from '../../../../actions/clientNotes';

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
import styles from './stylesClientNote';
import SalonHeader from '../../../../components/SalonHeader';


class ClientNote extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const canSave = params.canSave || false;
    const title = params.actionType === 'update' ? 'Edit Note' : 'New Note';

    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={(
            <SalonTouchableOpacity wait={3000} onPress={navigation.getParam('handleGoBack', () => { })}>
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity disabled={!canSave} wait={3000} onPress={navigation.getParam('handlePress', () => { })}>
              <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Save</Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    };
  }

  static compareByDate(a, b) {
    if (a.enterTime < b.enterTime) { return 1; }
    if (a.enterTime > b.enterTime) { return -1; }
    return 0;
  }

  state = {
    note: {
      id: Math.random().toString(),
      text: '',
      expiration: null,
      forAppointment: false,
      forQueue: false,
      forSales: false,
      isDeleted: false,
    },
    forSales: false,
    forQueue: false,
    forAppointment: false,
    datePickerOpen: false,
  };

  componentWillMount() {
    let { note } = this.state;
    const onEditionNote = this.props.navigation.state.params.note;
    const { client } = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'update') {
      note = Object.assign({}, onEditionNote);


      const provider = { fullName: note.enteredBy, name: note.enteredBy.split(' ')[0], lastName: note.enteredBy.split(' ')[1] };
      this.props.clientNotesActions.selectProvider(provider);

      const cachedForm = fetchFormCache('ClientNoteUpdate', onEditionNote.id, this.props.formCache);

      if (onEditionNote.id === cachedForm.id) {
        note = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      const cachedForm = fetchFormCache('ClientNoteNew', client.id, this.props.formCache);

      if (cachedForm) {
        note = cachedForm;
        const selectedProvider = this.props.clientNotesState.selectedProvider ? this.props.clientNotesState.selectedProvider : {};
        const providerName = !selectedProvider.isFirstAvailable ? ((`${selectedProvider.name || ''} ${selectedProvider.lastName || ''}`)) : 'First Available';

        note.enteredBy = providerName;
      } else {
        this.props.clientNotesActions.selectProvider(null);
      }
    }

    this.setState({
      note, forSales: note.forSales, forQueue: note.forQueue, forAppointment: note.forAppointment,
    });

    this.props.navigation.setParams({
      handlePress: () => this.saveNote(),
      handleGoBack: () => this.goBack(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { client } = this.props.navigation.state.params;
      if (this.shouldSave) {
        this.shouldSave = false;
        this.props.clientNotesActions.setClientNoteNewForm(
          client.id.toString(),
          prevState.note,
        );
      }
    } else if (this.shouldSave) {
      this.shouldSave = false;
      this.props.clientNotesActions.setClientNoteUpdateForm(prevState.note);
    }
  }

  onChangeProvider = (provider) => {
    this.props.clientNotesActions.selectProvider(provider);
    const { note } = this.state;

    const providerName = !provider.isFirstAvailable ? ((`${provider.name || ''} ${provider.lastName || ''}`).toUpperCase()) : 'First Available';

    note.enteredBy = providerName;
    this.setState({ note }, this.checkCanSave);
  }

  onChangeText = (txtNote) => {
    const { note } = this.state;
    note.text = txtNote;
    this.shouldSave = true;
    this.setState({ note }, this.checkCanSave);
  }


  inputDate = (selectedDate) => {
    const { note } = this.state;
    note.expiration = selectedDate;
    this.shouldSave = true;
    this.setState({ note }, this.checkCanSave);
  }

  inputSwitchQueue = () => {
    const { note } = this.state;
    note.forQueue = !this.state.forQueue;
    this.shouldSave = true;
    this.setState({ note, forQueue: !this.state.forQueue }, this.checkCanSave);
  }

  inputSwitchAppointment = () => {
    const { note } = this.state;
    note.forAppointment = !this.state.forAppointment;
    this.shouldSave = true;
    this.setState({ note, forAppointment: !this.state.forAppointment }, this.checkCanSave);
  }

  inputSwitchSales = () => {
    const { note } = this.state;
    note.forSales = !this.state.forSales;
    this.shouldSave = true;
    this.setState({ note, forSales: !this.state.forSales }, this.checkCanSave);
  }


  handlePressProvider = () => {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.clientNotesState;

    this.shouldSave = true;
  }


  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
    dismissOnSelect: true,
  });
  checkCanSave = () => {
    let isNoteValid = false;
    if (this.props.navigation.state.params.actionType === 'update') {
      const { text } = this.state.note;
      isNoteValid = text && text.length;
    } else {
      const { note } = this.state;
      isNoteValid = note.text &&
        note.text.length > 0 &&
        // note.expiration &&
        note.enteredBy;
    }

    this.props.navigation.setParams({ canSave: isNoteValid });
  }

  pickerToogleBirthday = () => {
    this.setState({ datePickerOpen: !this.state.datePickerOpen });
  };

  saveNote() {
    this.props.navigation.setParams({ canSave: false });
    const { client } = this.props.navigation.state.params;

    const note = Object.assign({}, this.state.note);
    note.notes = note.text;
    delete note.text;


    if (this.props.navigation.state.params.actionType === 'new') {
      delete note.id;
      delete note.isDeleted;

      this.props.clientNotesActions.postClientNotes(client.id, note)
        .then((response) => {
          this.props.clientNotesActions.selectProvider(null);
          this.props.navigation.goBack();
          this.props.navigation.state.params.onNavigateBack();
        }).catch((error) => {
        });
    } else if (this.props.navigation.state.params.actionType === 'update') {
      this.props.clientNotesActions.putClientNotes(client.id, note)
        .then((response) => {
          this.props.clientNotesActions.selectProvider(null);
          this.props.navigation.goBack();
          this.props.navigation.state.params.onNavigateBack();
        }).catch((error) => {
        });
    }
  }

  goBack() {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { client } = this.props.navigation.state.params;
      this.props.clientNotesActions.purgeClientNoteNewForm(
        client.id.toString(),
        this.state.note,
      );
    } else {
      this.props.clientNotesActions.purgeClientNoteUpdateForm(this.state.note);
    }
    this.props.navigation.goBack();
  }

  shouldSave = false

  render() {
    const params = this.props.navigation.state.params || {};
    const { apptBook = false } = params;
    return (

      <View style={styles.container}>
        {this.props.clientNotesState.isLoading &&
          <LoadingOverlay />
        }
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
          <View style={styles.topSeparator} />
          <InputGroup style={styles.providerInputGroup}>
            <ProviderInput
              apptBook={apptBook}
              placeholder={false}
              showFirstAvailable={false}
              filterByService
              style={styles.innerRow}
              selectedProvider={this.props.clientNotesState.selectedProvider}
              label="Added By"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              onChange={this.onChangeProvider}
              onPress={this.handlePressProvider}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
            />
          </InputGroup>
          <SectionTitle value="NOTE" style={styles.sectionTitle} />
          <InputGroup>
            <InputText
              placeholder="Write Note"
              onChangeText={this.onChangeText}
              value={this.state.note.text}
            />
          </InputGroup>
          <SectionTitle value="TYPES" style={styles.sectionTitle} />
          <InputGroup >
            <InputSwitch
              style={styles.inputSwitchSales}
              textStyle={styles.inputSwitchTextStyle}
              onChange={this.inputSwitchSales}
              value={this.state.forSales}
              text="Sales"
            />
            <InputDivider />
            <InputSwitch
              style={styles.inputSwitchAppointment}
              textStyle={styles.inputSwitchTextStyle}
              onChange={this.inputSwitchAppointment}
              value={this.state.forAppointment}
              text="Appointment"
            />
            <InputDivider />
            <InputSwitch
              style={styles.inputSwitchQueue}
              textStyle={styles.inputSwitchTextStyle}
              onChange={this.inputSwitchQueue}
              value={this.state.forQueue}
              text="Queue"
            />
          </InputGroup>
          <SectionDivider style={styles.sectionDivider} />

          <InputGroup>

            <SalonTimePicker
              minimumDate={moment().toDate()}
              format="MM-DD-YYYY"
              label="Expire Date"
              mode="date"
              placeholder="Optional"
              noIcon
              value={this.state.note.expiration}
              isOpen={this.state.datePickerOpen}
              onChange={this.inputDate}
              toggle={this.pickerToogleBirthday}
              valueStyle={this.state.note.expiration == null ? styles.valueStyleDate : {}}
            />

          </InputGroup>
        </KeyboardAwareScrollView>

      </View>
    );
  }
}

ClientNote.defaultProps = {

};

ClientNote.propTypes = {
  clientNotesActions: PropTypes.shape({
    setClientNoteNewForm: PropTypes.func.isRequired,
    setClientNoteUpdateForm: PropTypes.func.isRequired,
    selectProvider: PropTypes.func.isRequired,
    purgeClientNoteNewForm: PropTypes.func.isRequired,
    purgeClientNoteUpdateForm: PropTypes.func.isRequired,
    postClientNotes: PropTypes.func.isRequired,
    putClientNotes: PropTypes.func.isRequired,
  }).isRequired,
  clientNotesState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  formCache: PropTypes.any.isRequired,
};

const mapStateToProps = state => ({
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators({ ...clientNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNote);
