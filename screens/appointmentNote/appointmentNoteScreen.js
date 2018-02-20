import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';

import SalonIcon from '../../components/SalonIcon';
import SalonDatePicker from '../../components/modals/SalonDatePicker';
import SalonDateTxt from '../../components/SalonDateTxt';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  titleContainer: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 4.5,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C1C6',
    borderTopWidth: 1,
    borderTopColor: '#C0C1C6',
  },
  inputGroup: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  inputSubSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: '#C0C1C6',
  },
  placeholderText: {
    color: '#727A8F',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto',
    marginRight: 5,
  },
  inputText: {
    color: '#110A24',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto',
    marginRight: 5,
  },
});

const InputGroup = props => (
  <View style={styles.inputGroup}>
    {props.children}
  </View>
);

const Divider = () => (
  <View style={styles.divider} />
);

class AppointmentNoteScreen extends Component {
  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }
    return 0;
  }

  state = {
    dateModalVisible: false,
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

  showDatePicker() {
    this.setState({ dateModalVisible: true });
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

  renderNoteGroup = () => (<InputGroup>
    <View style={styles.inputSection}>
      {this.state.note.author !== null ? (
        <TouchableOpacity onPress={this.handlePressProvider} style={{ width: '100%', flexDirection: 'row' }}>
          <View style={[styles.inputSubSection, {
 borderBottomWidth: 0, width: '30%', flexDirection: 'row', justifyContent: 'flex-start',
}]}
          >
            <Text style={styles.placeholderText}>Added by</Text>
          </View>
          <View style={[styles.inputSubSection, {
 borderBottomWidth: 0, width: '70%', flexDirection: 'row', justifyContent: 'flex-end',
}]}
          >
            <Text style={styles.inputText}>{this.state.note.author}</Text>

            <SalonIcon style={{ tintColor: '#727A8F' }} icon="caretRight" size={15} />
          </View>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handlePressProvider} style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.inputSubSection, { borderBottomWidth: 0, width: '70%', flexDirection: 'row' }]}>
              <Text style={styles.placeholderText}>Added by</Text>
            </View>
            <View style={[styles.inputSubSection, {
 borderBottomWidth: 0,
width: '30%',
flexDirection: 'row',
justifyContent: 'flex-end',
}]}
            >
              <SalonIcon style={{ tintColor: '#727A8F' }} icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        )}
    </View>
    <Divider />
    <View style={styles.inputSection}>
      <View style={[styles.inputSubSection, { borderBottomWidth: 0, width: '30%', flexDirection: 'row' }]}>

        <Text style={styles.placeholderText}>Date</Text>

      </View>
      <View style={[styles.inputSubSection, {
borderBottomWidth: 0, width: '70%', flexDirection: 'row', justifyContent: 'flex-end',
}]}
      >
        <TouchableOpacity style={{ alignSelf: 'stretch', marginRight: 10 }} onPress={() => this.showDatePicker()}>
          <View style={styles.inputSubSection}>
            <SalonDateTxt dateFormat="DD MMMM YYYY" style={styles.inputText} value={this.state.note.date ? this.state.note.date : 'Optional'} />
          </View>
        </TouchableOpacity>
        {
        this.state.note.date &&
          <TouchableOpacity
            onPress={() => {
              const note = this.state.note;
              note.date = null;
              this.setState({ note });
          }}
          >
            <View style={styles.inputSubSection}>
              <SalonIcon style={{ tintColor: '#727A8F' }} icon="cross" size={15} />
            </View>
          </TouchableOpacity>
        }
      </View>
    </View>
    <Divider />
    <View style={styles.inputSection}>
      <TextInput
        multiline
        style={{ width: '100%' }}
        placeholder="Write Note"
        placeholderTextColor="#727A8F"
        numberOfLines={4}
        onChangeText={(txtNote) => {
            const note = this.state.note;
            note.note = txtNote;
            this.setState({ note });
        }}
        value={this.state.note.note}
      />
    </View>
  </InputGroup>)

  renderNoteTypeGroup = () => (
    <InputGroup>
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Sales</Text>
        <Switch
          onChange={() => {
             const note = this.state.note;
             if (!this.state.sales) {
               note.tags.push('SALES');
             } else {
               note.tags = note.tags.filter(a => a !== 'SALES');
             }

             console.log(note.tags);

            this.setState({ note, sales: !this.state.sales });
            }}
          value={this.state.sales}
        />
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Appointment</Text>
        <Switch
          onChange={() => {
             const note = this.state.note;
             if (!this.state.appointment) {
               note.tags.push('APPOINTMENT');
             } else {
               note.tags = note.tags.filter(a => a !== 'APPOINTMENT');
             }

            this.setState({ note, appointment: !this.state.appointment });
            }}
          value={this.state.appointment}
        />
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Queue</Text>
        <Switch
          onChange={() => {
              const note = this.state.note;
              if (!this.state.queue) {
                note.tags.push('QUEUE');
              } else {
                note.tags = note.tags.filter(a => a !== 'QUEUE');
              }

             this.setState({ note, queue: !this.state.queue });
            }}
          value={this.state.queue}
        />
      </View>
    </InputGroup>
  )


  renderTitle = title => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

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
        {this.renderTitle('')}
        {this.renderNoteGroup()}
        {this.renderTitle('NOTE TYPES')}
        {this.renderNoteTypeGroup()}
        <SalonDatePicker
          isVisible={this.state.dateModalVisible}
          onPress={(selectedDate) => {
            const note = this.state.note;
            note.date = selectedDate;
            this.setState({ note, dateModalVisible: false });
          }}
          selectedDate={this.state.note.date}
        />
      </View>
    );
  }
}

export default AppointmentNoteScreen;
