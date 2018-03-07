import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
} from 'react-native';

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

const styles = StyleSheet.create({
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
      expiration: '',
      forAppointment: false,
      forQueue: false,
      forSales: false,
      isDeleted: false,
    },
    sales: false,
    forQueue: false,
    appointment: false,
  };


  componentWillMount() {
    let note = this.state.note;

    console.log(this.props);

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
    });
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
        this.props.appointmentNotesActions.postAppointmentNotes(appointment.client.id, note).then((response) => {
          this.getNotes();
        }).catch((error) => {
          alert(error.message);
          console.log(error);
        });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const note = this.state.note;
        note.notes = note.text;
        this.props.appointmentNotesActions.putAppointmentNotes(appointment.client.id, note).then((response) => {
          this.getNotes();
        }).catch((error) => {
          alert(error.message);
          console.log(error);
        });
      }
    } else {
      alert('Please fill all the fields');
    }
  }


  getNotes = () => {
    const { appointment } = this.props.navigation.state.params;
    this.props.appointmentNotesActions.getAppointmentNotes(appointment.client.id).then((response) => {
      if (response.data.error) {
        // this.props.navigation.goBack();
        // alert(response.data.error.message);

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
  onChangeProvider = (provider) => {
    this.props.appointmentNotesActions.selectProvider(provider);
    const note = this.state.note;
    note.author = `${provider.name} ${provider.lastName}`;
    this.setState({ note });
  }

  handlePressProvider = () => {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.appointmentNotesState;

    this.props.walkInActions.setCurrentStep(3);

    if (selectedProvider) {
      navigate('Providers', {
        actionType: 'update',
        dismissOnSelect: this.dismissOnSelect,
        onChangeProvider: this.onChangeProvider,
        ...this.props,
      });
    } else {
      navigate('Providers', {
        actionType: 'new',
        dismissOnSelect: this.dismissOnSelect,
        onChangeProvider: this.onChangeProvider,
        ...this.props,
      });
    }
  }


  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.appointmentNotesState;
    navigate('AppointmentNoteScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 16, borderColor: 'transparent', borderWidth: 0 }} />
        <InputGroup style={{ flexDirection: 'row' }}>
          {[<InputButton
            onPress={this.handlePressProvider}
            placeholder="Added by"
            value={this.state.note.author}
          />]}
        </InputGroup>
        <SectionTitle value="NOTE" />
        <InputGroup>
          {[<InputText
            placeholder="Write Note"
            onChangeText={(txtNote) => {
                        const note = this.state.note;
                        note.text = txtNote;
                        this.setState({ note });
                    }}
            value={this.state.note.text}
          />]}

        </InputGroup>
        <SectionTitle value="TYPES" />
        <InputGroup >
          {[<InputSwitch
            onChange={(state) => {
      const note = this.state.note;
      note.forSales = !this.state.forSales;
      this.setState({ note, forSales: !this.state.forSales });
     }}
            value={this.state.forSales}
            text="Sales"
          />,
            <InputDivider />,
            <InputSwitch
              onChange={(state) => {
      const note = this.state.note;
      note.forAppointment = !this.state.forAppointment;
      this.setState({ note, forAppointment: !this.state.forAppointment });
     }}
              value={this.state.forAppointment}
              text="Appointment"
            />,


            <InputDivider />,
            <InputSwitch
              onChange={(state) => {
      const note = this.state.note;
      note.forQueue = !this.state.forQueue;
      this.setState({ note, forQueue: state });
     }}
              value={this.state.forQueue}
              text="Queue"
            />]}


        </InputGroup>
        <SectionDivider />

        <InputGroup style={{ flexDirection: 'row' }}>
          {[<InputDate
            placeholder="Expire Date"
            onPress={(selectedDate) => {
            const { note } = this.state;
            note.expiration = selectedDate;

            this.setState({ note });
            }}
            selectedDate={moment(this.state.note.expiration).isValid() ? moment(this.state.note.expiration).format('DD MMMM YYYY') : 'Optional'}
          />]}

        </InputGroup>
      </View>
    );
  }
}

export default AppointmentNoteScreen;
