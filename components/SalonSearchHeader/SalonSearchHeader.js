import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import SalonSearchBar from '../SalonSearchBar';
import SalonFlatPicker from '../SalonFlatPicker';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  headerContainer: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
    height: 115,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#115ECD',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingHorizontal: 10,
    paddingBottom: 8,
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
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});


class SalonSearchHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  showSuggestions() {
    this.props.salonSearchHeaderActions.setShowFilter(!this.props.salonSearchHeaderState.showFilter);
  }

  handleTypeChange=(ev, selectedIndex) => {
    this.props.salonSearchHeaderActions.setSelectedFilter(selectedIndex);
  }

  render() {
    return (
      <View style={[styles.headerContainer, this.props.headerContainerStyle]}>

        { !this.props.salonSearchHeaderState.showFilter &&
          this.props.children
        }

        <View style={[styles.topSearchBar, {
           paddingTop: !this.props.salonSearchHeaderState.showFilter ? 0 : 15,
           backgroundColor: !this.props.salonSearchHeaderState.showFilter ? '#F8F8F8' : '#115ECD',
         }]}
        >
          <SalonSearchBar
            placeHolderText="Search"
            containerStyle={{
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: !this.props.salonSearchHeaderState.showFilter ? 7 : 15,
              paddingRight: !this.props.salonSearchHeaderState.showFilter ? 7 : 2,
              paddingVertical: 5,
            }}
            marginVertical={!this.props.salonSearchHeaderState.showFilter ? 0 : 0}
            placeholderTextColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            showCancel={this.props.salonSearchHeaderState.showFilter}
            searchIconPosition="left"
            iconsColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            fontColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            borderColor="transparent"
            backgroundColor={!this.props.salonSearchHeaderState.showFilter ? 'rgba(142, 142, 147, 0.24)' : '#0C4699'}
            onChangeText={(searchText) => {
                this.props.salonSearchHeaderActions.setSearchText(searchText);
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

        {this.props.hasFilter && this.props.salonSearchHeaderState.showFilter &&
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
SalonSearchHeader.propTypes = {
  hasFilter: PropTypes.bool,
  headerContainerStyle: ViewPropTypes.style,
};

SalonSearchHeader.defaultProps = {
  hasFilter: true,
};
export default SalonSearchHeader;
