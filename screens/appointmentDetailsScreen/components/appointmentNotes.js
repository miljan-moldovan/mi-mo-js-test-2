import moment from 'moment';
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import SalonSearchBar from '../../../components/SalonSearchBar';
import SalonIcon from '../../../components/SalonIcon';
import SalonBtnFixedBottom from '../../../components/SalonBtnFixedBottom';
import SalonTag from '../../../components/SalonTag';
import SalonDateTxt from '../../../components/SalonDateTxt';
import SalonCard from '../../../components/SalonCard';

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

export default class AppoinmentNotes extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      notes: [{
        id: 1,
        date: '2017-02-17',
        author: 'Dora Knuckles',
        note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tags: ['SALES', 'QUEUE'],
      },
      {
        id: 2,
        date: '2017-04-23',
        author: 'Dora Knuckles',
        note: 'Nulla quis ipsum viverra, ornare arcu vel, dignissim dui. Mauris fringilla, augue ut imperdiet porttitor, lectus eros fermentum velit, vel interdum eros lacus non sem. Aliquam erat volutpat. Sed sagittis ornare consequat. Sed efficitur eleifend dolor id aliquam. Fusce fermentum urna eu odio lacinia, et mattis mi eleifend. Fusce ut augue nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas pellentesque quis mauris vel laoreet. Nunc ac elit eget quam scelerisque vestibulum at eu lacus.',
        tags: ['SALES'],
      },
      {
        id: 3,
        date: '2017-06-05',
        author: 'Dora Knuckles',
        note: 'Vestibulum ullamcorper finibus interdum. Nunc suscipit ut est vitae molestie. Donec malesuada dignissim commodo. Etiam pulvinar malesuada neque. Quisque nec urna eu velit dignissim lacinia. Sed in ligula vehicula, ultrices ex a, porttitor dui. Curabitur quis velit pharetra, tempor nunc vitae, dignissim justo. Integer feugiat ut ligula a facilisis. Nunc blandit ultrices pellentesque.',
        tags: ['QUEUE'],
      },
      {
        id: 4,
        date: '2017-11-08',
        author: 'Dora Knuckles',
        note: 'Ut egestas lectus odio, non consectetur lectus malesuada quis. Ut a erat pulvinar, rhoncus odio a, lacinia turpis. Curabitur suscipit cursus ligula non dapibus. Donec ullamcorper nulla fringilla velit sagittis lobortis. Duis malesuada felis tellus, at laoreet est molestie in. Nullam lorem mauris, commodo nec nulla in, imperdiet auctor elit. Proin mattis odio a finibus porta. Cras urna sapien, ultricies quis enim id, condimentum maximus nisl. In sagittis odio sed tempor ultricies. Aenean eget fermentum dolor. In hac habitasse platea dictumst. Phasellus magna tellus, euismod eu erat in, cursus sodales erat. Etiam feugiat pharetra orci imperdiet placerat. Fusce nec convallis ex.',
        tags: ['SALES', 'QUEUE'],
      },
      {
        id: 5,
        date: '2018-02-11',
        author: 'Dora Knuckles',
        note: 'Aliquam erat volutpat. Praesent pretium malesuada accumsan. Praesent efficitur ligula ultrices massa dictum, at aliquam mauris lacinia. Donec tempus libero ut posuere consequat. Vivamus quis vestibulum eros. Suspendisse quis lobortis diam. Donec a eros at dui interdum ullamcorper. Maecenas lorem nisi, lobortis id ligula in, lacinia sollicitudin justo. Fusce molestie metus purus, at consectetur urna ullamcorper quis. Duis quis diam non nunc dictum consequat. Aenean malesuada euismod libero finibus dignissim. Aliquam erat volutpat. Nunc porttitor diam nibh, quis fermentum lacus tincidunt sit amet. Donec tristique enim at lorem mattis, in posuere erat feugiat.',
        tags: ['SALES', 'QUEUE', 'APPOINMENT'],
      }],
      filteredNotes: [],
    };
  }

  componentWillMount() {
    this.setState({ filteredNotes: this.state.notes });
  }

  filterNotes(searchText) {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'author', Values: [searchText.toLowerCase()] },
        { Field: 'note', Values: [searchText.toLowerCase()] },
        { Field: 'date', Values: [searchText.toLowerCase()] },
      ];

      const filtered = AppoinmentNotes.flexFilter(this.state.notes, criteria);

      this.setState({ filteredNotes: filtered });
    } else {
      this.setState({ filteredNotes: this.state.notes });
    }
  }

  render() {
    return (
      <View style={styles.container}>
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
              onChangeText={searchText => this.filterNotes(searchText)}
            />
          </View>
          <View style={styles.tagsBar} >
            <View style={styles.tag}>
              <SalonTag
                key={Math.random().toString()}
                iconSize={13}
                icon="check"
                iconColor="#FFFFFF"
                tagHeight={24}
                backgroundColor="#1DBF12"
                value="Queue"
                valueSize={10}
                valueColor="#FFFFFF"
              />
            </View>
            <View style={styles.tag}>
              <SalonTag
                key={Math.random().toString()}
                iconSize={13}
                icon="check"
                iconColor="#FFFFFF"
                tagHeight={24}
                backgroundColor="#1DBF12"
                value="Sales"
                valueSize={10}
                valueColor="#FFFFFF"
              />
            </View>
            <View style={styles.tag}>
              <SalonTag
                key={Math.random().toString()}
                iconSize={13}
                icon="check"
                iconColor="#FFFFFF"
                tagHeight={24}
                backgroundColor="#1DBF12"
                value="Appointment"
                valueSize={10}
                valueColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        <View style={styles.notesScroller}>
          <ScrollView>
            <FlatList
              data={this.state.filteredNotes}
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
                          valueSize={12}
                        />

                        <Text style={styles.noteBy}>by</Text>
                        <Text style={styles.noteAuthor}>{item.author}</Text>

                      </View>
                      <View style={styles.noteHeaderRight}>
                        <TouchableOpacity
                          style={styles.dotsButton}
                          onPress={() => { alert(item.id); }}
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
                    <SalonTag key={Math.random().toString()} tagHeight={16} backgroundColor="#C3D6F2" value={tag} valueSize={10} valueColor="#2F3142" />
                  ))}
                />
            )}
            />
            <View style={styles.showDeletedButtonContainer}>

              <TouchableOpacity
                style={styles.showDeletedButton}
                onPress={() => {}}
              >
                <Text style={styles.showDeletedText}>Show deleted</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        <SalonBtnFixedBottom backgroundColor="#727A8F" onPress={() => {}} value="Add Note" valueSize={13} valueColor="#FFFFFF" />
      </View>
    );
  }
}
