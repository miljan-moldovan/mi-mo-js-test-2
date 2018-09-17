import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SalonActionSheet from '../../../../components/SalonActionSheet';
import SalonSearchBar from '../../../../components/SalonSearchBar';
import SalonIcon from '../../../../components/SalonIcon';
import FloatingButton from '../../../../components/FloatingButton';
import SalonTag from '../../../../components/SalonTag';
import SalonBtnTag from '../../../../components/SalonBtnTag';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonCard from '../../../../components/SalonCard';
import SalonViewMoreText from '../../../../components/SalonViewMoreText';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import styles from './stylesClientNotes';
import LoadingOverlay from '../../../../components/LoadingOverlay';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 1;
const options = [
  'Edit Note',
  'Delete/Undelete Note',
  'Cancel',
];

class ClientNotesScreen extends Component {
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
    let { client } = this.props;
    const { params } = this.props.navigation.state;
    const paramsClient = params.client;
    client = client || paramsClient;

    const showTagBar = 'showTagBar' in params ? params.showTagBar : true;
    const editionMode = 'editionMode' in params ? params.editionMode : true;

    const forQueue = 'forQueue' in params ? params.forQueue : true;
    const forSales = 'forSales' in params ? params.forSales : true;
    const forAppointment = 'forAppointment' in params ? params.forAppointment : true;

    this.state = {
      showTagBar,
      editionMode,
      client,
      note: null,
      forQueue,
      forSales,
      refreshing: false,
      showDeleted: false,
      forAppointment,
      searchText: '',
    };

    this.getNotes();
  }

  state: {
    showTagBar: false,
    editionMode: true,
    showDeleted: false,
    note: null,
    forAppointment: false,
    forQueue: false,
    forSales: false,
    client: {}
  }

  // componentWillMount() {
  //
  //   this.getNotes();
  // }

  onPressSalonBtnAppointment = () => {
    this.setState({ forAppointment: !this.state.forAppointment });
    this.filterNotes(this.state.searchText, this.state.showDeleted, this.state.forSales, !this.state.forAppointment, this.state.forQueue);
  }

  onPressSalonBtnSales = () => {
    this.setState({ forSales: !this.state.forSales });
    this.filterNotes(this.state.searchText, this.state.showDeleted, !this.state.forSales, this.state.forAppointment, this.state.forQueue);
  }

  onPressSalonBtnQueue = () => {
    this.setState({ forQueue: !this.state.forQueue });
    this.filterNotes(this.state.searchText, this.state.showDeleted, this.state.forSales, this.state.forAppointment, !this.state.forQueue);
  }

  setNoteTags = (note) => {
    const tags = [];

    if (note.forQueue) {
      tags.push(<SalonTag
        tagHeight={17}
        key={Math.random().toString()}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="QUEUE"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    if (note.forSales) {
      tags.push(<SalonTag
        tagHeight={17}
        key={Math.random().toString()}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="SALES"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    if (note.forAppointment) {
      tags.push(<SalonTag
        tagHeight={17}
        key={Math.random().toString()}
        backgroundColor={!note.isDeleted ? '#112F62' : '#B6B9C3'}
        value="APPOINTMENT"
        valueSize={10}
        valueColor="#FFFFFF"
      />);
    }

    return tags;
  }


  setTagsBar = () => {
    const activeStyle = {
      icon: 'check',
      iconColor: '#FFFFFF',
      backgroundColor: '#1DBF12',
      valueColor: '#FFFFFF',
    };

    const inactiveStyle = {
      icon: 'unchecked',
      iconColor: '#727A8F',
      backgroundColor: '#FFFFFF',
      valueColor: '#727A8F',
    };

    const tags = [
      <View key={Math.random().toString()} style={styles.tag}>
        <SalonBtnTag
          iconSize={13}
          onPress={this.onPressSalonBtnAppointment}
          tagHeight={24}
          value="Appointment"
          valueSize={10}
          isVisible={this.state.forAppointment}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
      </View>,
      <View key={Math.random().toString()} style={styles.tag}>
        <SalonBtnTag
          iconSize={13}
          onPress={this.onPressSalonBtnSales}
          tagHeight={24}
          value="Sales"
          valueSize={10}
          isVisible={this.state.forSales}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
      </View>,
      <View key={Math.random().toString()} style={styles.tag}>
        <SalonBtnTag
          iconSize={13}
          onPress={this.onPressSalonBtnQueue}
          tagHeight={24}
          value="Queue"
          valueSize={10}
          isVisible={this.state.forQueue}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
      </View>];


    return tags;
  }

  getNotes = () => {
    this.setState({ refreshing: true });

    this.props.clientNotesActions.getClientNotes(this.state.client.id).then((response) => {
      if (response.data.error) {
        this.props.clientNotesActions.setFilteredNotes([]);
        this.props.clientNotesActions.setNotes([]);
      } else {
        const notes = response.data.notes.sort(ClientNotesScreen.compareByDate);
        this.props.clientNotesActions.setFilteredNotes(notes);
        this.props.clientNotesActions.setNotes(notes);

        this.filterNotes(this.state.searchText, this.state.showDeleted, this.state.forSales, this.state.forAppointment, this.state.forQueue);

        this.setState({ refreshing: false });
      }
    });
  }


  deleteNoteAlert(note) {
    let deleteMessage = 'Delete Note';
    let deleteSubMessage = 'Are you sure you want to delete this note?';
    let deleteFunction = () => this.deleteNote(note);

    if (note.isDeleted) {
      deleteMessage = 'Undelete Note';
      deleteSubMessage = 'Are you sure you want to undelete this note?';
      deleteFunction = () => this.undeleteNote(note);
    }

    Alert.alert(
      deleteMessage,
      deleteSubMessage,
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: deleteFunction },
      ],
      { cancelable: false },
    );
  }

  deleteNote(note) {
    const { client } = this.props;
    this.props.clientNotesActions.deleteClientNotes(this.state.client.id, note.id).then((response) => {
      this.getNotes();
    }).catch((error) => {
    });
  }


  undeleteNote(note) {
    const { client } = this.props;
    this.props.clientNotesActions.undeleteClientNotes(this.state.client.id, note.id).then((response) => {
      this.getNotes();
    }).catch((error) => {
    });
  }

  editNote(note) {
    const params = this.props.navigation.state.params || {};
    const { apptBook = false } = params;

    //  this.props.clientNotesActions.setOnEditionNote(note);
    const { navigate } = this.props.navigation;
    const { item } = this.props.navigation.state.params;
    navigate('ClientNote', {
      mode: 'modal',
      actionType: 'update',
      note,
      client: this.props.client,
      onNavigateBack: this.getNotes,
      apptBook,
      ...this.props,
    });
  }

  reloadAfterChange = () => {
    this.filterNotes(this.state.searchText, this.state.showDeleted, this.state.forSales, this.state.forAppointment, this.state.forQueue);
  }

  showActionSheet = (note) => {
    this.setState({ note }, () => { this.SalonActionSheet.show(); });
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

  filterNotes(searchText, showDeleted, forSales, forAppointment, forQueue) {
    const baseNotes = showDeleted ?
      this.props.clientNotesState.notes :
      this.props.clientNotesState.notes.filter(el =>
        !el.isDeleted && (el.expiration ? moment(el.expiration).isSameOrAfter(moment().startOf('day')) : true));


    if (searchText && searchText.length > 0) {
      this.setState({ searchText });

      const criteria = [
        { Field: 'enteredBy', Values: [searchText.toLowerCase()] },
        { Field: 'text', Values: [searchText.toLowerCase()] },
        { Field: 'enterTime', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientNotesScreen.flexFilter(
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

      tagNotes = tagNotes.sort(ClientNotesScreen.compareByDate);

      this.props.clientNotesActions.setFilteredNotes(tagNotes);
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

      tagNotes = tagNotes.sort(ClientNotesScreen.compareByDate);
      this.props.clientNotesActions.setFilteredNotes(tagNotes);
    }
  }

  renderViewMore = onPress => (
    <Text style={styles.moreText} onPress={onPress}>... more</Text>
  )

  onPressDelete = () => {
    this.setState({ showDeleted: !this.state.showDeleted });
    this.filterNotes(this.state.searchText, !this.state.showDeleted, this.state.forSales, this.state.forAppointment, this.state.forQueue);
  }

  render() {
    const params = this.props.navigation.state.params || {};
    const { apptBook = false } = params;

    return (
      <View style={styles.container}>

        { this.props.clientNotesState.isLoading &&
        <LoadingOverlay />
            }


        <SalonActionSheet
          ref={o => this.SalonActionSheet = o}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />

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
                placeHolderText="Search"
                marginVertical={0}
                placeholderTextColor="#727A8F"
                searchIconPosition="left"
                iconsColor="#727A8F"
                fontColor="#727A8F"
                containerStyle={styles.salonSearchBarContainer}
                borderColor="transparent"
                backgroundColor="rgba(142, 142, 147, 0.24)"
                onChangeText={searchText => this.filterNotes(searchText, this.state.showDeleted, this.state.forSales, this.state.forAppointment, this.state.forQueue)}
              />
            </View>
            {this.state.showTagBar &&
              <View style={styles.tagsBar} >
                {this.setTagsBar()}
              </View>
            }
          </View>
          <View style={styles.notesScroller}>
            <View style={styles.notesView}>
              <FlatList
                extraData={this.props}
                keyExtractor={(item, index) => index}
                data={this.props.clientNotesState.filtered}
                renderItem={({ item, index }) => (
                  <SalonCard
                    containerStyles={styles.salonCardContainer}
                    bodyStyles={styles.salonCardBody}
                    key={index}
                    backgroundColor={!item.isDeleted ? '#FFFFFF' : '#F8F8F8'}
                    headerChildren={[
                      <View style={styles.noteTags}>
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
                          <Text style={styles.noteAuthor}>{item.enteredBy}</Text>

                        </View>
                        <View style={styles.noteHeaderRight}>

                          {this.state.editionMode &&
                          <SalonTouchableOpacity
                            style={styles.dotsButton}
                            onPress={() => { this.showActionSheet(item); }}
                          >
                            <SalonIcon
                              size={16}
                              icon="dots"
                              style={styles.dotsIcon}
                            />
                          </SalonTouchableOpacity>}
                        </View>
                      </View>]}

                    bodyChildren={[
                      <SalonViewMoreText
                        numberOfLines={3}
                        renderViewMore={this.renderViewMore}
                      //  renderViewLess={this.renderViewLess}
                      >
                        <Text
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

              <View style={styles.showDeletedButtonContainer}>
                {this.state.editionMode ?
                  <SalonTouchableOpacity
                    style={styles.showDeletedButton}
                    onPress={this.onPressDelete}
                  >
                    <Text style={styles.showDeletedText}>{this.state.showDeleted ? 'Hide deleted/expired notes' : 'Show Deleted/expired notes'}</Text>
                  </SalonTouchableOpacity> : null
              }
              </View>

            </View>
          </View>
        </ScrollView>
        <KeyboardSpacer />

        {this.state.editionMode ?
          <FloatingButton
            rootStyle={styles.floatingButtonRoot}
            handlePress={() => {
            const { navigate } = this.props.navigation;
            navigate('ClientNote', {
             mode: 'modal',
            actionType: 'new',
            ...this.props,
            apptBook,
            client: this.props.client,
             onNavigateBack: this.getNotes,
            });
          }}
          >
            <SalonIcon
              size={24}
              icon="plus"
              style={styles.plusIcon}
            />
          </FloatingButton> : null}
      </View>
    );
  }
}

ClientNotesScreen.defaultProps = {
};

ClientNotesScreen.propTypes = {
  clientNotesActions: PropTypes.shape({
    getClientNotes: PropTypes.func.isRequired,
    setFilteredNotes: PropTypes.func.isRequired,
    setNotes: PropTypes.func.isRequired,
    deleteClientNotes: PropTypes.func.isRequired,
    undeleteClientNotes: PropTypes.func.isRequired,
    setOnEditionNote: PropTypes.func.isRequired,
  }).isRequired,
  clientNotesState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default ClientNotesScreen;
