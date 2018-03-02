import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import SalonActionSheet from '../../../../components/SalonActionSheet';
import SalonSearchBar from '../../../../components/SalonSearchBar';
import SalonIcon from '../../../../components/SalonIcon';
import SalonBtnFixedBottom from '../../../../components/SalonBtnFixedBottom';
import SalonTag from '../../../../components/SalonTag';
import SalonBtnTag from '../../../../components/SalonBtnTag';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonCard from '../../../../components/SalonCard';
import AppointmentNotes from '../../../../constants/AppointmentNotes';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 1;
const options = [
  'Edit Note',
  'Delete Note',
  'Cancel',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  header: {
    flex: 2,
    // paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  notesScroller: {
    flex: 9,
    backgroundColor: '#F1F1F1',
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  noteHeaderRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  topSearchBar: {
    marginTop: 10,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tagsBar: {
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  notesContainer: {
    paddingTop: 0,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteTags: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  showDeletedButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showDeletedText: {
    color: '#115ECD',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  showDeletedButtonContainer: {
    minHeight: 40,
    marginBottom: 40,
  },
  noteText: {
    color: '#2E3032',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  noteAuthor: {
    color: '#2F3142',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  noteBy: {
    paddingHorizontal: 5,
    color: '#4D5067',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
  },
  checkIcon: {
    width: 10,
    height: 13,
    marginLeft: 5,
    paddingTop: 1,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  dotsIcon: {
    width: 13,
    height: 16,
    marginLeft: 5,
    paddingTop: 1,
    resizeMode: 'contain',
    tintColor: '#115ECD',
  },
});

// const notes = require('../../../mockData/clientDetails/notes.json');

export default class AppointmentNotesScreen extends Component {
  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;
      for (let n = 0; n < info.length; n += 1) {
        if (item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }
    return 0;
  }

  constructor(props) {
    super(props);

    this.state = {
      showDeleted: false,
      note: null,
    };
  }

  state:{

  }

  componentWillMount() {
    const notes = this.props.appointmentNotesState.notes.sort(AppointmentNotesScreen.compareByDate);
    this.props.appointmentNotesActions.setFilteredNotes(notes);

    this.filterNotes(null, false);
  }


  deleteNoteAlert(note) {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteNote(note) },
      ],
      { cancelable: false },
    );
  }

  deleteNote(note) {
    note.active = 0;
    let notes = this.props.appointmentNotesState.notes;
    notes = notes.sort(AppointmentNotesScreen.compareByDate);

    this.props.appointmentNotesActions.setNotes(notes);
    this.props.appointmentNotesActions.setFilteredNotes(notes);

    this.filterNotes(null, this.state.showDeleted);
  }


  editNote(note) {
    this.props.appointmentNotesActions.setOnEditionNote(note);
    const { navigate } = this.props.navigation;
    navigate('AppointmentNote', {
      actionType: 'update',
      note,
      ...this.props,
    });
  }

  onPressTagFilter = (value) => {
    let filterTypes = this.props.appointmentNotesState.filterTypes;

    if (filterTypes.indexOf(value) > -1) {
      filterTypes = filterTypes.splice(filterTypes.indexOf(value), 1);
    } else {
      filterTypes.push(value);
    }

    this.filterNotes(null, this.state.showDeleted);
  }


  showActionSheet = (note) => {
    this.setState({ note });
    this.SalonActionSheet.show();
  };

  handlePress = (i) => {
    setTimeout(() => {
      this.handlePressAction(i);
    }, 500);
    return false;
  }

  handlePressAction(i) {
    switch (i) {
      case 0:
        this.editNote(this.state.note);
        break;
      case 1:
        this.deleteNoteAlert(this.state.note);
        break;
      default:
        break;
    }

    return false;
  }

  filterNotes(searchText, showDeleted) {
    const baseNotes = showDeleted ? this.props.appointmentNotesState.notes :
      this.props.appointmentNotesState.notes.filter(el => el.active === 1);

    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'author', Values: [searchText.toLowerCase()] },
        { Field: 'note', Values: [searchText.toLowerCase()] },
        { Field: 'date', Values: [searchText.toLowerCase()] },
      ];

      const filtered = AppointmentNotesScreen.flexFilter(
        baseNotes,
        criteria,
      );

      let tagNotes = [];

      for (let i = 0; i < filtered.length; i++) {
        const note = filtered[i];
        const found = note.tags.some(v => this.props.appointmentNotesState.filterTypes.indexOf(v) != -1);
        if (found) {
          tagNotes.push(note);
        }
      }

      tagNotes = tagNotes.sort(AppointmentNotesScreen.compareByDate);

      this.props.appointmentNotesActions.setFilteredNotes(tagNotes);
    } else {
      let tagNotes = [];

      for (let i = 0; i < baseNotes.length; i++) {
        const note = baseNotes[i];
        const found = note.tags.some(v => this.props.appointmentNotesState.filterTypes.indexOf(v) != -1);
        if (found) {
          tagNotes.push(note);
        }
      }

      tagNotes = tagNotes.sort(AppointmentNotesScreen.compareByDate);
      this.props.appointmentNotesActions.setFilteredNotes(tagNotes);
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <SalonActionSheet
          ref={o => this.SalonActionSheet = o}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(i) => { this.handlePress(i); }}
        />


        <View style={styles.header}>
          <View style={styles.topSearchBar}>
            <SalonSearchBar
              placeHolderText="Search"
              marginVertical={0}
              placeholderTextColor="#727A8F"
              searchIconPosition="left"
              iconsColor="#727A8F"
              fontColor="#727A8F"
              borderColor="transparent"
              backgroundColor="rgba(142, 142, 147, 0.24)"
              onChangeText={searchText => this.filterNotes(searchText, this.state.showDeleted)}
            />
          </View>
          <View style={styles.tagsBar} >

            {AppointmentNotes.filterTypes.map((filterType) => {
              const isSelected = this.props.appointmentNotesState.filterTypes.indexOf(filterType) > -1;

              return (<View key={Math.random().toString()} style={styles.tag}>
                <SalonBtnTag
                  iconSize={13}
                  onPress={this.onPressTagFilter}
                  tagHeight={24}
                  value={filterType}
                  valueSize={10}

                  isVisible={isSelected}

                  activeStyle={{
                      icon: 'check',
                      iconColor: '#FFFFFF',
                      backgroundColor: '#1DBF12',
                      valueColor: '#FFFFFF',
                    }}

                  inactiveStyle={{
                      icon: 'unchecked',
                      iconColor: '#727A8F',
                      backgroundColor: '#FFFFFF',
                      valueColor: '#727A8F',
                    }}

                />
              </View>);
            })}

          </View>
        </View>
        <View style={styles.notesScroller}>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            <FlatList
              extraData={this.props}
              keyExtractor={(item, index) => index}
              data={this.props.appointmentNotesState.filtered}
              renderItem={({ item, index }) => (


                <SalonCard
                  key={index}
                  backgroundColor="#FFFFFF"
                  headerChildren={[
                    <View style={styles.noteTags} key={Math.random().toString()}>
                      <View style={styles.noteHeaderLeft}>

                        <SalonDateTxt
                          dateFormat="MMM. DD YYYY"
                          value={item.date}
                          valueColor="#000000"
                          fontFamily="Roboto-Bold"
                          valueSize={12}
                        />

                        <Text style={styles.noteBy}>by</Text>
                        <Text style={styles.noteAuthor}>{item.author}</Text>

                      </View>
                      <View style={styles.noteHeaderRight}>
                        <TouchableOpacity
                          style={styles.dotsButton}
                          onPress={() => { this.showActionSheet(item); }}
                        >
                          <SalonIcon
                            size={16}
                            icon="dots"
                            style={styles.dotsIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>]}

                  bodyChildren={[
                    <Text
                      key={Math.random().toString()}
                      style={styles.noteText}
                    >{item.note}
                    </Text>]}

                  footerChildren={item.tags.map(tag => (
                    <SalonTag key={Math.random().toString()} tagHeight={20} backgroundColor="rgb(17,47,98)" value={tag} valueSize={10} valueColor="#FFFFFF" />
                  ))}
                />
            )}
            />
            <View style={styles.showDeletedButtonContainer}>

              <TouchableOpacity
                style={styles.showDeletedButton}
                onPress={() => {
                  this.setState({ showDeleted: !this.state.showDeleted });
                  this.filterNotes(null, !this.state.showDeleted);
                }}
              >
                <Text style={styles.showDeletedText}>{this.state.showDeleted ? 'Hide deleted' : 'Show deleted'}</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        <SalonBtnFixedBottom
          backgroundColor="#727A8F"
          onPress={() => {
            const { navigate } = this.props.navigation;
            navigate('AppointmentNote', { actionType: 'new' });
        }}
          value="Add New Note"
          valueSize={13}
          valueColor="#FFFFFF"
        />
      </View>
    );
  }
}
