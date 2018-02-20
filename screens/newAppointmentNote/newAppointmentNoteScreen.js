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
});

const InputGroup = props => (
  <View style={styles.inputGroup}>
    {props.children}
  </View>
);

const Divider = () => (
  <View style={styles.divider} />
);

class NewAppointmentNoteScreen extends Component {
  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }
    return 0;
  }

  state = {
    sales: false,
    queue: false,
    appointment: false,
    selectedDate: null,
    dateModalVisible: false,
    note: '',
    isNoteComplete: true,
  };


  componentWillMount() {
    this.props.navigation.setParams({
      handlePress: () => this.addNote(),
    });
  }

  showDatePicker() {
    this.setState({ dateModalVisible: true });
  }

  addNote() {
    if (this.state.isNoteComplete) {
      let notes = this.props.appointmentNotesState.notes;
      notes.push(JSON.parse(JSON.stringify(this.props.appointmentNotesState.note)));

      this.props.appointmentNotesActions.selectProvider(null);

      this.props.appointmentNotesActions.addNote({
        id: Math.random().toString(),
        date: '',
        author: '',
        note: '',
        tags: [],
        active: 1,
      });

      notes = notes.sort(NewAppointmentNoteScreen.compareByDate);
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
    this.props.appointmentNotesActions.addNote(note);
  }

  setNoteProperty(name, value) {
    const note = this.props.appointmentNotesState.note;
    if (name === 'note') {
      note.note = value;
    } else if (name === 'date') {
      note.date = value;
    } else if (name === 'author') {
      note.author = value;
    } else if (name === 'tags') {
      note.tags.push(value);
    }

    this.props.appointmentNotesActions.addNote(note);
  }


  renderNoteGroup = () => {
    const { selectedProvider } = this.props.appointmentNotesState;
    return (<InputGroup>
      <View style={styles.inputSection}>
        {selectedProvider ? (
          <TouchableOpacity onPress={this.handlePressProvider} style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.inputSection, {
 borderBottomWidth: 0, width: '70%', flexDirection: 'row', justifyContent: 'flex-start',
}]}
            >
              <Text style={styles.placeholderText}>Added by</Text>
              <Text style={styles.inputText}>{selectedProvider.name} {selectedProvider.lastName}</Text>
            </View>
            <View style={[styles.inputSection, {
 borderBottomWidth: 0, width: '30%', flexDirection: 'row', justifyContent: 'flex-end',
}]}
            >
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handlePressProvider} style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.inputSection, { borderBottomWidth: 0, width: '70%', flexDirection: 'row' }]}>
              <Text style={styles.placeholderText}>Added by</Text>
            </View>
            <View style={[styles.inputSection, {
 borderBottomWidth: 0, width: '30%', flexDirection: 'row', justifyContent: 'flex-end',
}]}
            >
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Date</Text>
        <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={() => this.showDatePicker()}>
          <View style={styles.inputSection}>
            <Text style={styles.placeholderText}>{this.state.selectedDate ? this.state.selectedDate : 'Optional'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <TextInput
          multiline
          style={{ width: '100%' }}
          placeholder="Write Note"
          placeholderTextColor="#727A8F"
          numberOfLines={4}
          onChangeText={(note) => {
            this.setState({ note });
            this.setNoteProperty('note', note);
        }}
          value={this.state.note}
        />
      </View>
    </InputGroup>);
  }

  renderNoteTypeGroup = () => (
    <InputGroup>
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Sales</Text>
        <Switch
          onChange={() => {
             this.setState({ sales: !this.state.sales });
             this.setNoteProperty('tags', 'SALES');
            }}
          value={this.state.sales}
        />
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Appointment</Text>
        <Switch
          onChange={() => {
             this.setState({ appointment: !this.state.appointment });
             this.setNoteProperty('tags', 'APPOINTMENT');
            }}
          value={this.state.appointment}
        />
      </View>
      <Divider />
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Queue</Text>
        <Switch
          onChange={() => {
             this.setState({ queue: !this.state.queue });
             this.setNoteProperty('tags', 'QUEUE');
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
    navigate('NewAppointmentNoteScreen');
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
            this.setState({ selectedDate, dateModalVisible: false });
            this.setNoteProperty('date', selectedDate);
          }}
          selectedDate={this.state.selectedDate}
        />
      </View>
    );
  }
}

export default NewAppointmentNoteScreen;
