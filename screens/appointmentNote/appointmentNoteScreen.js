import React, { Component } from 'react';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

class AppointmentNoteScreen extends Component {
  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }
    return 0;
  }

  state = {
    note: {
      id: Math.random().toString(),
      date: null,
      author: '',
      note: '',
      tags: [],
      active: 1,
    },
    sales: false,
    queue: false,
    appointment: false,
  };


  componentWillMount() {
    if (this.props.navigation.state.params.actionType === 'update') {
      const sales = this.props.appointmentNotesState.onEditionNote.tags.indexOf('Sales') > -1;
      const queue = this.props.appointmentNotesState.onEditionNote.tags.indexOf('Queue') > -1;
      const appointment = this.props.appointmentNotesState.onEditionNote.tags.indexOf('Appointment') > -1;

      this.setState({
        note: this.props.appointmentNotesState.onEditionNote, sales, queue, appointment,
      });
    }

    this.props.navigation.setParams({
      handlePress: () => this.saveNote(),
    });
  }


  isNoteValid() {
    if (this.state.note.note.length === 0) {
      return false;
    } else if (this.state.note.author === '') {
      return false;
    } else if (this.state.note.tags.length === 0) {
      return false;
    }

    return true;
  }

  saveNote() {
    if (this.isNoteValid()) {
      let notes = this.props.appointmentNotesState.notes;

      if (this.props.navigation.state.params.actionType === 'new') {
        notes.push(this.state.note);
      }

      this.props.appointmentNotesActions.selectProvider(null);
      notes = notes.sort(AppointmentNoteScreen.compareByDate);
      this.props.appointmentNotesActions.setNotes(notes);
      this.props.appointmentNotesActions.setFilteredNotes(notes);
      this.props.appointmentNotesActions.selectedFilterTypes([]);
      this.props.navigation.goBack();
    } else {
      alert('Please fill all the fields');
    }
  }

  onChangeProvider = (provider) => {
    this.props.appointmentNotesActions.selectProvider(provider);
    const note = this.props.appointmentNotesState.note;
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
          <InputButton
            onPress={this.handlePressProvider}
            placeholder="Added by"
            value={this.state.note.author}
          />
        </InputGroup>
        <SectionTitle value="NOTE" />
        <InputGroup>
          <InputText
            placeholder="Write Note"
            onChangeText={(txtNote) => {
                const note = this.state.note;
                note.note = txtNote;
                this.setState({ note });
            }}
            value={this.state.note.note}
          />
        </InputGroup>
        <SectionTitle value="TYPES" />
        <InputGroup >

          <InputSwitch
            onChange={(state) => {
               const note = this.state.note;
               if (!this.state.sales) {
                 note.tags.push('SALES');
               } else {
                 note.tags = note.tags.filter(a => a !== 'SALES');
               }
              this.setState({ note, sales: !this.state.sales });
             }}
            text="Sales"
          />

          <InputDivider />
          <InputSwitch
            onChange={(state) => {
               const note = this.state.note;
               if (!this.state.appointment) {
                 note.tags.push('APPOINTMENT');
               } else {
                 note.tags = note.tags.filter(a => a !== 'APPOINTMENT');
               }

              this.setState({ note, appointment: !this.state.appointment });
             }}
            text="Appointment"
          />


          <InputDivider />
          <InputSwitch
            onChange={(state) => {
               const note = this.state.note;
               if (!this.state.queue) {
                 note.tags.push('QUEUE');
               } else {
                 note.tags = note.tags.filter(a => a !== 'QUEUE');
               }

              this.setState({ note, queue: state });
             }}
            text="Queue"
          />

        </InputGroup>
        <SectionDivider />

        <InputGroup style={{ flexDirection: 'row' }}>
          <InputDate
            placeholder="Expire Date"
            onPress={(selectedDate) => {
              const { note } = this.state;
              note.date = selectedDate;
              this.setState({ note });
              }}
            selectedDate={this.state.note.date ? this.state.note.date : 'Optional'}
          />
        </InputGroup>
      </View>
    );
  }
}

export default AppointmentNoteScreen;
