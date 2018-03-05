import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonSearchBar from '../../../../components/SalonSearchBar';
import SalonIcon from '../../../../components/SalonIcon';
import SalonBtnFixedBottom from '../../../../components/SalonBtnFixedBottom';
import SalonTag from '../../../../components/SalonTag';
import SalonBtnTag from '../../../../components/SalonBtnTag';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonCard from '../../../../components/SalonCard';

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
  formulaText: {
    color: '#2E3032',
    fontSize: 10,
    lineHeight: 16,
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
  formulaType: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Roboto',
    color: '#2F3142',
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#C3D6F2',
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  fixedBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  fixedBtnText: {
    fontSize: 12,
    lineHeight: 12,
    color: '#FFFFFF',
  },
  fixedBtnIconContainer: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#4D5067',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class AppointmentFormulas extends Component {
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
      activeCategories: [],
      existingCategories: [],
      showDeleted: true,
    };
  }

  componentWillMount() {
    const formulas = this.props.appointmentFormulasState.formulas.sort(AppointmentFormulas.compareByDate);
    this.props.appointmentFormulasActions.setFilteredFormulas(formulas);
    this.setState({
      activeCategories: this.existingCategories(),
      existingCategories: this.existingCategories(),
    });
  }

  existingCategories = () => {
    const { formulas } = this.props.appointmentFormulasState;
    const existing = [];
    for (let i = 0; i < formulas.length; i += 1) {
      if (existing.indexOf(formulas[i].category) < 0) {
        existing.push(formulas[i].category);
      }
    }

    return existing;
  }

  // filterNotes(searchText) {
  //   if (searchText && searchText.length > 0) {
  //     const criteria = [
  //       { Field: 'provider', Values: [searchText.toLowerCase()] },
  //       { Field: 'service', Values: [searchText.toLowerCase()] },
  //       { Field: 'category', Values: [searchText.toLowerCase()] },
  //       { Field: 'date', Values: [searchText.toLowerCase()] },
  //     ];

  //     const filtered = AppointmentFormulas.flexFilter(
  //       this.props.appointmentFormulasState.formulas,
  //       criteria,
  //     );

  //     this.props.appointmentFormulasActions.setFilteredFormulas(filtered);
  //   } else {
  //     this.props.appointmentFormulasActions.setFilteredFormulas(this.props.appointmentFormulasState.formulas);
  //   }
  // }

  onPressTagFilter = (value) => {
    const filterTypes = this.state.activeCategories;

    if (filterTypes.indexOf(value) > -1) {
      filterTypes.splice(filterTypes.indexOf(value), 1);
    } else {
      filterTypes.push(value);
    }

    console.log('active', filterTypes, this.state.activeCategories);
    this.setState({ activeCategories: filterTypes });
    this.filterNotes(null, this.state.showDeleted);
  }

  filterNotes(searchText, showDeleted) {
    const baseFormulas = showDeleted ? this.props.appointmentFormulasState.formulas :
      this.props.appointmentFormulasState.formulas.filter(el => el.active === 1);

    let tagFormulas = [];
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'provider', Values: [searchText.toLowerCase()] },
        { Field: 'category', Values: [searchText.toLowerCase()] },
        { Field: 'service', Values: [searchText.toLowerCase()] },
        { Field: 'date', Values: [searchText.toLowerCase()] },
      ];

      const filtered = AppointmentFormulas.flexFilter(
        baseFormulas,
        criteria,
      );


      for (let i = 0; i < filtered.length; i++) {
        const formula = filtered[i];
        const found = this.state.activeCategories.indexOf(formula.category) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(AppointmentFormulas.compareByDate);
      this.props.appointmentFormulasActions.setFilteredFormulas(tagFormulas);
    } else {
      for (let i = 0; i < baseFormulas.length; i += 1) {
        const formula = baseFormulas[i];

        const found = this.state.activeCategories.indexOf(formula.category) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(AppointmentFormulas.compareByDate);
      this.props.appointmentFormulasActions.setFilteredFormulas(tagFormulas);
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
            {this.state.existingCategories.map(item => (
              <View style={styles.tag} key={Math.random().toString()}>
                <SalonBtnTag
                  iconSize={13}
                  onPress={this.onPressTagFilter}
                  tagHeight={24}
                  value={item}
                  valueSize={10}
                  isVisible={this.state.activeCategories.indexOf(item) !== -1}
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
              </View>
            ))}
          </View>
        </View>
        <View style={styles.notesScroller}>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            <FlatList
              extraData={this.props}
              keyExtractor={(item, index) => index}
              style={{ alignSelf: 'stretch', flex: 1 }}
              data={this.props.appointmentFormulasState.filtered}
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
                      </View>
                      <Text style={styles.formulaType}>{item.category.toUpperCase()}</Text>
                    </View>]}
                  bodyChildren={[
                    <View style={{ flexDirection: 'column' }} key={Math.random().toString()}>
                      <Text style={styles.noteText}>
                        <Text style={[styles.noteText, styles.boldText]}>{item.service}</Text>
                        <Text style={styles.italicText}> by</Text> {item.provider}
                      </Text>
                      <Text style={styles.formulaText}>Sport Clip Haircuts of Dallas/Knox St</Text>
                    </View>]}
                />
              )}
            />
            <View style={styles.showDeletedButtonContainer}>
              <TouchableOpacity
                style={styles.showDeletedButton}
                onPress={() => {
                  this.setState({ showDeleted: false });
                }}
              >
                <Text style={styles.showDeletedText}>Show deleted</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <SalonBtnFixedBottom
          backgroundColor="#727A8F"
          onPress={() => {
            const { navigate } = this.props.navigation;
            navigate('AppointmentFormula');
          }}
          valueSize={13}
          valueColor="#FFFFFF"
        >
          <View style={styles.fixedBtnContainer}>
            <Text style={styles.fixedBtnText}>Add Formula</Text>
            <View style={styles.fixedBtnIconContainer}>
              <SalonIcon tintColor="#FFFFFF" icon="plus" size={12} />
            </View>
          </View>
        </SalonBtnFixedBottom>
      </View>
    );
  }
}
