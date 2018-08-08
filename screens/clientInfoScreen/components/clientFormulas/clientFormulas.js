import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { find } from 'lodash';
import SalonSearchBar from '../../../../components/SalonSearchBar';
import SalonIcon from '../../../../components/SalonIcon';
import SalonBtnTag from '../../../../components/SalonBtnTag';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonCard from '../../../../components/SalonCard';
import FloatingButton from '../../../../components/FloatingButton';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  header: {
    // flex: 2,
    // paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  formulasScroller: {
    flex: 9,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  formulaHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  formulaHeaderRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  topSearchBar: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 53,
  },
  tagsBar: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 38,
  },
  formulasContainer: {
    paddingTop: 0,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaTags: {
    height: 17,
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
  formulaText: {
    color: '#5E5F61',
    fontSize: 10,
    fontFamily: 'Roboto-Light',
    fontWeight: 'normal',
    marginVertical: 5,
  },
  formulaTextTitle: {
    color: '#2E3032',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  formulaAuthor: {
    color: '#2F3142',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  formulaBy: {
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
    //  resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  dotsIcon: {
    width: 13,
    height: 16,
    marginLeft: 5,
    paddingTop: 1,
    // resizeMode: 'contain',
    tintColor: '#115ECD',
  },
  formulaTypeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#082e66',
  },
  formulaType: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
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


const formulaTypes = [
  { id: 0, name: 'Color' },
  { id: 1, name: 'Perm' },
  { id: 2, name: 'Skin' },
  { id: 3, name: 'Nail' },
  { id: 4, name: 'Massage' },
  { id: 5, name: 'Hair' },
  { id: -1, name: 'NULL' },
];


export default class ClientFormulas extends Component {
  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;

      for (let n = 0; n < info.length; n += 1) {
        if (info[n].Field === 'formulaType') {
          const type = find(formulaTypes, { id: item.formulaType });
          const formulaType = type.name;

          if (formulaType.toLowerCase().indexOf(info[n].Values) > -1) {
            count += 1;
          }
        } else if (info[n].Field === 'service') {
          if (item.service.name.toLowerCase().indexOf(info[n].Values) > -1) {
            count += 1;
          }
        } else if ((typeof item[info[n].Field]) === 'string' && item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
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

    const { client } = this.props;

    this.state = {
      client,
      activeTypes: [],
      existingTypes: [],
      showDeleted: false,
    };
  }

  componentWillMount() {
    this.props.clientFormulasActions.getClientFormulas(this.state.client.id).then((response) => {
      if (response.data.error) {
        this.props.clientFormulasActions.setFilteredFormulas([]);
        this.props.clientFormulasActions.setFormulas([]);
      } else {
        const formulas = this.props.clientFormulasState.formulas.sort(ClientFormulas.compareByDate);
        console.log(this.props.clientFormulasState.formulas);
        this.props.clientFormulasActions.setFilteredFormulas(formulas);
        this.setState({
          activeTypes: this.existingTypes(),
          existingTypes: this.existingTypes(),
        });
      }
    });
  }

  existingTypes = () => {
    const { formulas } = this.props.clientFormulasState;


    const existing = [];
    for (let i = 0; i < formulas.length; i += 1) {
      const type = this.getFormulaTypeName(formulas[i].formulaType);

      if (existing.indexOf(type) < 0) {
        existing.push(type);
      }
    }

    return existing;
  }


  onPressTagFilter = (value) => {
    const filterTypes = this.state.activeTypes;

    if (filterTypes.indexOf(value) > -1) {
      filterTypes.splice(filterTypes.indexOf(value), 1);
    } else {
      filterTypes.push(value);
    }
    this.setState({ activeTypes: filterTypes });
    this.filterFormulas(null, this.state.showDeleted);
  }


  getFormulaTypeName = (id) => {
    const type = find(formulaTypes, { id });
    return type.name;
  }

  filterFormulas(searchText, showDeleted) {
    const baseFormulas = showDeleted ? this.props.clientFormulasState.formulas :
      this.props.clientFormulasState.formulas.filter(el => !el.isDeleted);

    let tagFormulas = [];
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'provider', Values: [searchText.toLowerCase()] },
        { Field: 'formulaType', Values: [searchText.toLowerCase()] },
        { Field: 'service', Values: [searchText.toLowerCase()] },
        { Field: 'date', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientFormulas.flexFilter(
        baseFormulas,
        criteria,
      );


      for (let i = 0; i < filtered.length; i += 1) {
        const formula = filtered[i];

        const type = this.getFormulaTypeName(formula.formulaType);

        const found = this.state.activeTypes.indexOf(type) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(ClientFormulas.compareByDate);
      this.props.clientFormulasActions.setFilteredFormulas(tagFormulas);
    } else {
      for (let i = 0; i < baseFormulas.length; i += 1) {
        const formula = baseFormulas[i];

        const type = this.getFormulaTypeName(formula.formulaType);

        const found = this.state.activeTypes.indexOf(type) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(ClientFormulas.compareByDate);
      this.props.clientFormulasActions.setFilteredFormulas(tagFormulas);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.topSearchBar}>
            <SalonSearchBar
              containerStyle={{ paddingHorizontal: 8 }}
              placeHolderText="Search"
              marginVertical={0}
              placeholderTextColor="#727A8F"
              searchIconPosition="left"
              iconsColor="#727A8F"
              fontColor="#727A8F"
              borderColor="transparent"
              backgroundColor="rgba(142, 142, 147, 0.24)"
              onChangeText={searchText => this.filterFormulas(searchText)}
            />
          </View>
          <View style={styles.tagsBar} >
            {this.state.existingTypes.map(item => (
              <View style={styles.tag} key={Math.random().toString()}>
                <SalonBtnTag
                  onPress={this.onPressTagFilter}
                  tagHeight={24}
                  value={item}
                  valueSize={10}
                  isVisible={this.state.activeTypes.indexOf(item) !== -1}
                  activeStyle={{
                    icon: 'check',
                    iconColor: '#FFFFFF',
                    backgroundColor: '#1DBF12',
                    valueColor: '#FFFFFF',
                    iconSize: 8,
                  }}
                  inactiveStyle={{
                    icon: 'square',
                    iconColor: '#727A8F',
                    backgroundColor: '#FFFFFF',
                    valueColor: '#727A8F',
                    iconSize: 16,
                  }}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.formulasScroller}>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            <FlatList
              extraData={this.props}
              keyExtractor={(item, index) => index}
              style={{ alignSelf: 'stretch', marginTop: 4 }}
              data={this.props.clientFormulasState.filtered}
              renderItem={({ item, index }) => (
                <SalonCard
                  key={index}
                  containerStyles={{ marginVertical: 2, marginHorizontal: 8 }}
                  backgroundColor="#FFFFFF"
                  headerChildren={[
                    <View style={styles.formulaTags} key={Math.random().toString()}>
                      <View style={styles.formulaHeaderLeft}>
                        <SalonDateTxt
                          dateFormat="MMM. DD"
                          value={item.date}
                          valueColor="#000000"
                          valueSize={12}
                          fontWeight="500"
                        />
                        <SalonDateTxt
                          dateFormat=" YYYY"
                          value={item.date}
                          valueColor="#000000"
                          valueSize={12}
                          fontWeight="normal"
                        />
                      </View>
                      <View style={styles.formulaTypeTag}>
                        <Text style={styles.formulaType}>{this.getFormulaTypeName(item.formulaType)}</Text>
                      </View>
                      <SalonTouchableOpacity
                        onPress={() => alert('Screen Not Implemented')}
                        style={{ marginRight: 10 }}
                      >
                        <FontAwesome
                          style={{
                            marginLeft: 10,
                            color: '#115ECD',
                            fontSize: 22,
                          }}
                        >{Icons.angleRight}
                        </FontAwesome>
                      </SalonTouchableOpacity>
                    </View>]}
                  bodyChildren={[
                    <View style={{ flexDirection: 'column', height: 33 }} key={Math.random().toString()}>
                      <Text style={styles.formulaTextTitle}>
                        <Text style={[styles.formulaTextTitle, styles.boldText]}>{item.service.name}</Text>
                        <Text style={styles.italicText}> by</Text> {item.stylistName}
                      </Text>
                      <Text style={styles.formulaText}>{item.store.name}</Text>
                    </View>]}
                />
              )}
            />
            <View style={styles.showDeletedButtonContainer}>
              <SalonTouchableOpacity
                style={styles.showDeletedButton}
                onPress={() => {
                  this.setState({ showDeleted: !this.state.showDeleted });
                }}
              >
                <Text style={styles.showDeletedText}>{this.state.showDeleted ? 'Hide deleted' : 'Show deleted'}</Text>
              </SalonTouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <FloatingButton
          rootStyle={{
            height: 56,
            width: 56,
            bottom: 25,
            borderRadius: 56 / 2,
            backgroundColor: '#115ECD',
          }}
          handlePress={() => {
            const { navigate } = this.props.navigation;
            navigate('ClientFormula');
          //  alert('Screen Not Implemented');
          }}
        >
          <SalonIcon tintColor="#FFFFFF" icon="plus" size={21} />
        </FloatingButton>
        {
        //   <SalonBtnFixedBottom
        //   backgroundColor="#727A8F"
        //   onPress={() => {
        //     const { navigate } = this.props.navigation;
        //     navigate('ClientFormula');
        //   }}
        //   valueSize={13}
        //   valueColor="#FFFFFF"
        // >
        //   <View style={styles.fixedBtnContainer}>
        //     <Text style={styles.fixedBtnText}>Add Formula</Text>
        //     <View style={styles.fixedBtnIconContainer}>
        //       <SalonIcon tintColor="#FFFFFF" icon="plus" size={12} />
        //     </View>
        //   </View>
        // </SalonBtnFixedBottom>
      }
      </View>
    );
  }
}
