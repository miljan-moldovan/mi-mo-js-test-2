import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SalonSearchBar from '../../../components/SalonSearchBar';
import SalonTag from '../../../components/SalonTag';
import SalonDateTxt from '../../../components/SalonDateTxt';
import SalonCard from '../../../components/SalonCard';
import SalonViewMoreText from '../../../components/SalonViewMoreText';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import Icon from '../../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  header: {
    flex: 2,
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
    alignItems: 'center',
    flex: 1,
  },
  noteHeaderRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  topSearchBar: {
    // marginTop: 8,
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
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  showDeletedButtonContainer: {
    minHeight: 40,
    marginBottom: 40,
  },
  noteText: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  moreText: {
    color: '#3343CA',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  noteAuthor: {
    color: '#2F3142',
    fontSize: 12,
    fontFamily: 'Roboto',
    paddingBottom: 1,
  },
  noteBy: {
    paddingHorizontal: 5,
    color: '#4D5067',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    paddingBottom: 1,
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
  plusIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  headerNav: {
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '500',
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
});

export default class AppointmentNotesScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { client } = params;
    return {
      headerTitle:
        (
          <View style={styles.headerNav}>
            <Text style={styles.nameText}>{`${client.name} ${client.lastName}`}</Text>
            <Text style={styles.titleText}>Appointment notes</Text>
          </View>
        ),
      headerLeft: (
        <SalonTouchableOpacity onPress={navigation.goBack}>
          <Icon
            name="angleLeft"
            size={28}
            style={{ paddingHorizontal: 2 }}
            color="#fff"
            type="light"
          />
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity>
          <Icon
            name="infoCircle"
            size={20}
            color="#fff"
            type="regular"
            style={{ paddingHorizontal: 2 }}
          />
        </SalonTouchableOpacity>
      )

    };
  };

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
    if (a.enterTime < b.enterTime) { return 1; }
    if (a.enterTime > b.enterTime) { return -1; }
    return 0;
  }

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.state = {
      forQueue: true,
      forSales: true,
      refreshing: false,
      showDeleted: false,
      forAppointment: true,
    };
  }

  state:{
    showDeleted: false,
    forAppointment: true,
    forQueue: true,
    forSales: true,
  }

  componentWillMount() {
    //this.getNotes();
  }

  getNotes = () => {
    const clientId = this.props.navigation.state.params.client.id;
    this.props.noteActions.getAppointmentNotes(clientId);
  }

  filterNotes(searchText, showDeleted, forSales, forAppointment, forQueue) {
    const baseNotes = showDeleted ?
      this.props.appointmentNotesState.notes : this.props.appointmentNotesState.notes.filter(el => !el.isDeleted);

    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'updatedBy', Values: [searchText.toLowerCase()] },
        { Field: 'text', Values: [searchText.toLowerCase()] },
        { Field: 'enterTime', Values: [searchText.toLowerCase()] },
      ];

      const filtered = AppointmentNotesScreen.flexFilter(
        baseNotes,
        criteria,
      );

      let tagNotes = [];

      for (let i = 0; i < filtered.length; i += 1) {
        const note = filtered[i];

        if (forAppointment && note.forAppointment) {
          tagNotes.push(note);
        } else if (forSales && note.forSales) {
          tagNotes.push(note);
        } else if (forQueue && note.forQueue) {
          tagNotes.push(note);
        } else if (!note.forAppointment && !note.forSales && !note.forQueue) {
          tagNotes.push(note);
        }
      }

      tagNotes = tagNotes.sort(AppointmentNotesScreen.compareByDate);

      this.props.noteActions.setFilteredNotes(tagNotes);
    } else {
      let tagNotes = [];

      for (let i = 0; i < baseNotes.length; i += 1) {
        const note = baseNotes[i];
        if (forAppointment && note.forAppointment) {
          tagNotes.push(note);
        } else if (forSales && note.forSales) {
          tagNotes.push(note);
        } else if (forQueue && note.forQueue) {
          tagNotes.push(note);
        } else if (!note.forAppointment && !note.forSales && !note.forQueue) {
          tagNotes.push(note);
        }
      }

      tagNotes = tagNotes.sort(AppointmentNotesScreen.compareByDate);
      this.props.noteActions.setFilteredNotes(tagNotes);
    }
  }

  setNoteTags = (note) => {
    const tags = [];

    if (note.forQueue) {
      tags.push(<SalonTag
        key={Math.random().toString()}
        tagHeight={17}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="QUEUE"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    if (note.forSales) {
      tags.push(<SalonTag
        key={Math.random().toString()}
        tagHeight={17}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="SALES"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    if (note.forAppointment) {
      tags.push(<SalonTag
        key={Math.random().toString()}
        tagHeight={17}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="APPOINTMENT"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    return tags;
  }

  renderViewMore(onPress) {
    return (
      <Text style={styles.moreText} onPress={onPress}>... more</Text>
    );
  }
  renderViewLess(onPress) {
    // return (
    //   <Text style={styles.moreText} onPress={onPress}> less</Text>
    // );
  }

  render() {
    return (
      <View style={styles.container}>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getNotes}
            />
          }
        >
          <View style={styles.header}>
            <View style={styles.topSearchBar}>
              <SalonSearchBar
                placeHolderText="Search by notes or provider"
                marginVertical={0}
                placeholderTextColor="#727A8F"
                searchIconPosition="left"
                iconsColor="#727A8F"
                fontColor="#727A8F"
                containerStyle={{ paddingTop: 4}}
                borderColor="transparent"
                backgroundColor="rgba(142, 142, 147, 0.24)"
                onChangeText={searchText => this.filterNotes(searchText, this.state.showDeleted, this.state.forSales, this.state.forAppointment, this.state.forQueue)}
              />
            </View>
          </View>
          <View style={styles.notesScroller}>
            <View style={{ alignSelf: 'stretch' }}>
              <FlatList
                extraData={this.props}
                keyExtractor={(item, index) => index}
                data={this.props.appointmentNotesState.notes}
                renderItem={({ item, index }) => (
                  <SalonCard
                    containerStyles={{ marginVertical: 2 }}
                    bodyStyles={{ minHeight: 57 }}
                    key={index}
                    backgroundColor={!item.isDeleted ? '#FFFFFF' : '#F8F8F8'}
                    headerChildren={[
                      <View style={styles.noteTags} key={Math.random().toString()}>
                        <View style={styles.noteHeaderLeft}>

                          <SalonDateTxt
                            dateFormat="MMM. DD"
                            value={item.enterTime}
                            valueColor={!item.isDeleted ? '#000000' : '#4D5065'}
                            fontFamily="Roboto-Bold"
                            valueSize={12}
                            fontWeight="500"
                          />

                          <SalonDateTxt
                            dateFormat=" YYYY"
                            value={item.enterTime}
                            valueColor={!item.isDeleted ? '#000000' : '#4D5065'}
                            fontFamily="Roboto-Bold"
                            valueSize={12}
                            fontWeight="normal"
                          />

                          <Text style={styles.noteBy}>by</Text>
                          <Text style={styles.noteAuthor}>{item.updatedBy}</Text>

                        </View>
                      </View>]}

                    bodyChildren={[
                      <SalonViewMoreText
                        numberOfLines={3}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        textStyle={{ }}
                      >
                        <Text
                          key={Math.random().toString()}
                          style={[styles.noteText, { color: !item.isDeleted ? '#2E3032' : '#58595B' }]}
                        >
                          {item.text}
                        </Text>
                      </SalonViewMoreText>,
                  ]}

                    footerChildren={this.setNoteTags(item)}
                  />
            )}
              />
            </View>
          </View>
        </ScrollView>
        <KeyboardSpacer />
      </View>
    );
  }
}
