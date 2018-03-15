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
  InputButton,
  InputDivider,
  InputSwitch,
  InputDate,
  SectionDivider,
  SectionTitle,
  InputText,
} from '../../components/formHelpers';

import fetchFormCache from '../../utilities/fetchFormCache';
import AppointmentNoteHeader from './components/appointmentNoteHeader';

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
});

class AppointmentNoteScreen extends Component {
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
    isVisible: true,
  };

  componentWillMount() {
    let note = this.state.note;

    const { appointment } = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'update') {
      note = JSON.parse(JSON.stringify(this.props.appointmentNotesState.onEditionNote));

      const cachedForm = fetchFormCache('AppointmentNoteScreenUpdate', this.props.appointmentNotesState.onEditionNote.id, this.props.formCache);

      if (this.props.appointmentNotesState.onEditionNote.id === cachedForm.id) {
        note = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      const cachedForm = fetchFormCache('AppointmentNoteScreenNew', appointment.client.id, this.props.formCache);

      if (cachedForm) {
        note = cachedForm;
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
      const { appointment } = this.props.navigation.state.params;
      if (this.shouldSave) {
        this.shouldSave = false;
        this.props.appointmentNotesActions.setAppointmentNoteNewForm(
          appointment.client.id.toString(),
          prevState.note,
        );
      }
    } else if (this.shouldSave) {
      this.shouldSave = false;
      this.props.appointmentNotesActions.setAppointmentNoteUpdateForm(prevState.note);
    }
  }

  onChangeProvider = (provider) => {
    this.props.appointmentNotesActions.selectProvider(provider);
    const note = this.state.note;
    note.author = `${provider.name} ${provider.lastName}`;
    this.setState({ note, isVisible: true });
  }

  getNotes = () => {
    const { appointment } = this.props.navigation.state.params;
    this.props.appointmentNotesActions.getAppointmentNotes(appointment.client.id)
      .then((response) => {
        if (response.data.error) {
          this.props.appointmentNotesActions.setFilteredNotes([]);
          this.props.appointmentNotesActions.setNotes([]);
        } else {
          const notes = response.data.notes.sort(AppointmentNoteScreen.compareByDate);
          this.props.appointmentNotesActions.setFilteredNotes(notes);
          this.props.appointmentNotesActions.setNotes(notes);
          this.props.appointmentNotesActions.selectProvider(null);

          this.props.navigation.goBack();
        }
      });
  }

  shouldSave = false

  goBack() {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { appointment } = this.props.navigation.state.params;
      this.props.appointmentNotesActions.purgeAppointmentNoteNewForm(
        appointment.client.id.toString(),
        this.state.note,
      );
    } else {
      this.props.appointmentNotesActions.purgeAppointmentNoteUpdateForm(this.state.note);
    }
    this.setState({ isVisible: false });
    this.props.navigation.goBack();
  }

  isNoteValid() {
    if (this.state.note.text.length === 0) {
      return false;
    } else if (this.state.note.author === '') {
      return false;
    }

    return true;
  }

  saveNote() {
    if (this.isNoteValid()) {
      const notes = this.props.appointmentNotesState.notes;
      const { appointment } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
        const note = this.state.note;
        note.notes = note.text;
        this.props.appointmentNotesActions.postAppointmentNotes(appointment.client.id, note)
          .then((response) => {
            this.getNotes();
          }).catch((error) => {
            console.log(error);
          });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const note = this.state.note;
        note.notes = note.text;
        this.props.appointmentNotesActions.putAppointmentNotes(appointment.client.id, note)
          .then((response) => {
            this.getNotes();
          }).catch((error) => {
            console.log(error);
          });
      }
    } else {
      alert('Please fill all the fields');
    }
  }


  handlePressProvider = () => {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.appointmentNotesState;

    this.props.walkInActions.setCurrentStep(3);

    this.shouldSave = true;

    this.setState({ isVisible: false });

    if (selectedProvider) {
      navigate('Providers', {
        actionType: 'update',
        dismissOnSelect: this.dismissOnSelect,
        onChangeProvider: this.onChangeProvider,
        onNavigateBack: this.handleOnNavigateBack,
        ...this.props,
      });
    } else {
      navigate('Providers', {
        actionType: 'new',
        dismissOnSelect: this.dismissOnSelect,
        onChangeProvider: this.onChangeProvider,
        onNavigateBack: this.handleOnNavigateBack,
        ...this.props,
      });
    }
  }

  handleOnNavigateBack = () => {
    console.log('handleOnNavigateBack');
    this.setState({ isVisible: true });
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('AppointmentNoteScreen');
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}
      >
        <View style={styles.container}>
          <AppointmentNoteHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <View style={{ marginTop: 15.5, borderColor: 'transparent', borderWidth: 0 }} />
            <InputGroup style={{ flexDirection: 'row', height: 44 }}>
              {[<InputButton
                style={{ flex: 1 }}
                labelStyle={{ color: '#110A24' }}
                onPress={this.handlePressProvider}
                placeholder="Added by"
                label={this.state.note.author}
              />]}
            </InputGroup>
            <SectionTitle value="NOTE" style={{ height: 38 }} />
            <InputGroup>
              {[<InputText
                placeholder="Write Note"
                onChangeText={(txtNote) => {
                        const note = this.state.note;
                        note.text = txtNote;
                        this.shouldSave = true;
                        this.setState({ note });
                    }}
                value={this.state.note.text}
              />]}

            </InputGroup>
            <SectionTitle value="TYPES" style={{ height: 37 }} />
            <InputGroup >
              {[<InputSwitch
                style={{ height: 43 }}
                textStyle={{ color: '#000000' }}
                onChange={(state) => {
                  const note = this.state.note;
                  note.forSales = !this.state.forSales;
                  this.shouldSave = true;
                  this.setState({ note, forSales: !this.state.forSales });
                }}
                value={this.state.forSales}
                text="Sales"
              />,
                <InputDivider />,
                <InputSwitch
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                    const note = this.state.note;
                    note.forAppointment = !this.state.forAppointment;
                    this.shouldSave = true;
                    this.setState({ note, forAppointment: !this.state.forAppointment });
                  }}
                  value={this.state.forAppointment}
                  text="Appointment"
                />,


                <InputDivider />,
                <InputSwitch
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                  const note = this.state.note;
                  note.forQueue = !this.state.forQueue;
                  this.shouldSave = true;
                  this.setState({ note, forQueue: state });
                 }}
                  value={this.state.forQueue}
                  text="Queue"
                />]}


            </InputGroup>
            <SectionDivider style={{ height: 37 }} />

            <InputGroup style={{ flexDirection: 'row' }}>
              {[<InputDate
                placeholder="Expire Date"
                onPress={(selectedDate) => {
                const { note } = this.state;
                note.expiration = selectedDate;
                this.shouldSave = true;
                this.setState({ note });
              }}
                selectedDate={this.state.note.expiration == null ? 'Optional' : moment(this.state.note.expiration).format('DD MMMM YYYY')}
              />]}

            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

export default AppointmentNoteScreen;
