import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import SalonSearchBar from '../SalonSearchBar';
import SalonFlatPicker from '../SalonFlatPicker';

// const filterType = ['This store', 'All stores'];

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  headerContainer: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#115ECD',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  topSearchBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  filterBarContainer: {
    backgroundColor: '#115ECD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

});


class SalonSearchHeader extends React.Component {
  constructor(props) {
    super(props);
    debugger //eslint-disable-line
  }

  showSuggestions() {
    this.props.salonSearchHeaderActions.setShowFilter(!this.props.salonSearchHeaderState.showFilter);
  }

  handleTypeChange=(ev, selectedIndex) => {
    this.props.salonSearchHeaderActions.setSelectedFilter(selectedIndex);
  }


  render() {
    return (
      <View style={styles.headerContainer}>

        { !this.props.salonSearchHeaderState.showFilter &&
          <View style={styles.header}>

            <TouchableOpacity
              style={{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    }}
              onPress={() => { this.props.navigation.goBack(); }}
            >
              <View>
                <Text style={{
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        backgroundColor: 'transparent',
        }}
                >Cancel
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      }}
            >
              <Text
                style={{
        fontFamily: 'Roboto',
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        }}
              >
                {this.props.salonSearchHeaderState.title}
              </Text>
              {this.props.salonSearchHeaderState.subTitle &&
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    color: '#fff',
                    fontSize: 10,
                  }}
                >
                  {this.props.salonSearchHeaderState.subTitle}
                </Text>
              }
            </View>

            <TouchableOpacity
              style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        }}
              onPress={() => { this.props.navigation.navigate('NewClientScreen'); }}
            >
              <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      }}
              >
                <Text style={{
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Roboto',
      backgroundColor: 'transparent',
      }}
                >Add
                </Text>
              </View>
            </TouchableOpacity>


          </View>}

        <View style={[styles.topSearchBar, {
           paddingTop: !this.props.salonSearchHeaderState.showFilter ? 0 : 15,
           backgroundColor: !this.props.salonSearchHeaderState.showFilter ? '#F8F8F8' : '#115ECD',
         }]}
        >
          <SalonSearchBar
            placeHolderText="Search"
            marginVertical={!this.props.salonSearchHeaderState.showFilter ? 0 : 30}
            placeholderTextColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            showCancel={this.props.salonSearchHeaderState.showFilter}
            searchIconPosition="left"
            iconsColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            fontColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            borderColor="transparent"
            backgroundColor={!this.props.salonSearchHeaderState.showFilter ? 'rgba(142, 142, 147, 0.24)' : '#0C4699'}
            onChangeText={(searchText) => {
                this.props.filterList(searchText);
                if (searchText && searchText.length > 0) {
                  this.props.salonSearchHeaderActions.setShowFilter(true);
                } else {
                  this.props.salonSearchHeaderActions.setShowFilter(false);
                }
              }
            }
            onFocus={() => { this.showSuggestions(); }}
          />
        </View>

        { this.props.salonSearchHeaderState.showFilter &&
        <View style={styles.filterBarContainer}>

          <View style={styles.filterBar}>
            <SalonFlatPicker
              dataSource={this.props.salonSearchHeaderState.filterTypes}
              selectedColor="#FFFFFF"
              selectedTextColor="#115ECD"
              unSelectedTextColor="#FFFFFF"
              onItemPress={this.handleTypeChange}
              selectedIndex={this.props.salonSearchHeaderState.selectedFilter}
            />

          </View>
        </View>
       }

      </View>

    );
  }
}

export default SalonSearchHeader;
