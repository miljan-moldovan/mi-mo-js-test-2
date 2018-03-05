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
      notes: '',
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
    if (this.props.navigation.state.params.actionType === 'update') {
      const forSales = this.props.appointmentNotesState.onEditionNote.forSales;
      const forQueue = this.props.appointmentNotesState.onEditionNote.forQueue;
      const forAppointment = this.props.appointmentNotesState.onEditionNote.forAppointment;

      this.setState({
        note: this.props.appointmentNotesState.onEditionNote, forSales, forQueue, forAppointment,
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
    }

    return true;
  }

  saveNote() {
  //  if (this.isNoteValid()) {
    if (true) {
      const notes = this.props.appointmentNotesState.notes;

      if (this.props.navigation.state.params.actionType === 'new') {
        this.props.appointmentNotesActions.postAppointmentNotes(this.state.note).then((response) => {
          this.props.appointmentNotesActions.getAppointmentNotes().then((response) => {
            this.props.appointmentNotesActions.setNotes(response.data.notes);
            this.props.appointmentNotesActions.setFilteredNotes(response.data.notes);
            this.props.appointmentNotesActions.selectProvider(null);

            this.props.navigation.goBack();
          }).catch((error) => {
            alert(error.message);
            console.log(error);
          });
        }).catch((error) => {
          alert(error.message);
          console.log(error);
        });
      } else {

      }
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
                note.notes = txtNote;
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
              note.forSales = !this.state.forSales;
              this.setState({ note, forSales: !this.state.forSales });
             }}
            text="Sales"
          />

          <InputDivider />
          <InputSwitch
            onChange={(state) => {
              const note = this.state.note;
              note.forAppointment = !this.state.forAppointment;
              this.setState({ note, forAppointment: !this.state.forAppointment });
             }}
            text="Appointment"
          />


          <InputDivider />
          <InputSwitch
            onChange={(state) => {
              const note = this.state.note;
              note.forQueue = !this.state.forQueue;
              this.setState({ note, forQueue: state });
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
            selectedDate={moment(this.state.note.date, 'YYYY-MM-DD', true).isValid() ? moment(this.state.note.date).format('DD MMMM YYYY') : 'Optional'}
          />
        </InputGroup>
      </View>
    );
  }
}

export default AppointmentNoteScreen;
