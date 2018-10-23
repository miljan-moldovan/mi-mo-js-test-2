import React from 'react';
import { View, ViewPropTypes, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import SalonSearchBar from '../SalonSearchBar';
import SalonFlatPicker from '../SalonFlatPicker';
import SalonTouchableOpacity from '../SalonTouchableOpacity';

import styles from './styles';

class SalonSearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedOnChange = debounce(this.onChangeText, 500);
  }

  componentWillUnmount() {
    const {
      salonSearchHeaderActions: { setSearchText },
    } = this.props;
    setSearchText('');
  }

  onChangeText = (searchText) => {
    if (searchText.length > this.props.salonSearchHeaderState.ignoredNumberOfLetters) {
      this.props.salonSearchHeaderActions.setSearchText(searchText);
      this.props.salonSearchHeaderState.filterList(searchText);
    }
    if (searchText && searchText.length > 0) {
      this.props.salonSearchHeaderActions.setShowFilter(true);
    } else {
      if (this.searchBar) {
        this.searchBar.blurInput();
      }
      this.props.salonSearchHeaderActions.setShowFilter(false);
      this.props.salonSearchHeaderActions.setSearchText('');
      if (this.props.clearSearch) {
        this.props.clearSearch();
      }
    }
  };

  onInputBlur = () => {
    const {
      salonSearchHeaderState: {
        searchText,
        showFilter,
      },
      salonSearchHeaderActions: { setShowFilter },
    } = this.props;
    if (searchText.length === 0 && showFilter) {
      setShowFilter(false);
    }
  }

  handleTypeChange = (ev, selectedIndex) => {
    this.props.salonSearchHeaderActions.setSelectedFilter(selectedIndex);
  };

  showSuggestions = () => {
    this.props.salonSearchHeaderActions.setShowFilter(!this.props.salonSearchHeaderState.showFilter);
  }

  render() {
    return (
      <View
        style={[
          styles.headerContainer,
          this.props.headerContainerStyle,
          {
            height:
              this.props.salonSearchHeaderState.showFilter && !this.props.hasFilter ? 70 : 115,
          },
        ]}
      >
        {!this.props.salonSearchHeaderState.showFilter && (
          <View style={styles.header}>
            <View style={styles.leftButton}>
              <SalonTouchableOpacity style={{ flex: 1 }} onPress={this.props.leftButtonOnPress}>
                {this.props.leftButton}
              </SalonTouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{this.props.title}</Text>
              {this.props.subTitle && (
                <Text style={styles.subTitleText}>{this.props.subTitle}</Text>
              )}
            </View>
            <View style={styles.rightButton}>
              {
                this.props.rightButton ?
                  (
                    <SalonTouchableOpacity
                      style={{ flex: 1 }}
                      onPress={this.props.rightButtonOnPress}
                    >
                      {this.props.rightButton}
                    </SalonTouchableOpacity>
                  ) : null
              }
            </View>
          </View>
        )}

        <View
          style={[
            styles.topSearchBar,
            {
              paddingTop: !this.props.salonSearchHeaderState.showFilter ? 0 : 15,
              backgroundColor: !this.props.salonSearchHeaderState.showFilter
                ? '#F1F1F1'
                : '#115ECD',
            },
          ]}
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
            placeholderTextColor={
              !this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'
            }
            showCancel={this.props.salonSearchHeaderState.showFilter}
            searchIconPosition="left"
            iconsColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            fontColor={!this.props.salonSearchHeaderState.showFilter ? '#727A8F' : '#FFFFFF'}
            borderColor="transparent"
            backgroundColor={
              !this.props.salonSearchHeaderState.showFilter ? 'rgba(142,142,147,0.24)' : '#0C4699'
            }
            onChangeText={this.debouncedOnChange}
            onFocus={this.showSuggestions}
            onBlur={this.onInputBlur}
            handleCancel={this.props.leftButtonOnPress}
            onClear={this.onInputBlur}
            ref={(ref) => { this.searchBar = ref; }}
          />
        </View>

        {this.props.hasFilter &&
          this.props.salonSearchHeaderState.showFilter && (
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
          )}
      </View>
    );
  }
}

SalonSearchHeader.defaultProps = {
  headerContainerStyle: {},
  subTitle: '',
  leftButtonOnPress: () => { },
  leftButton: null,
  clearSearch: () => { },
};

SalonSearchHeader.propTypes = {
  hasFilter: PropTypes.bool,
  headerContainerStyle: ViewPropTypes.style,
  salonSearchHeaderState: PropTypes.shape({
    showFilter: PropTypes.bool.isRequired,
    filterList: PropTypes.func.isRequired,
    ignoredNumberOfLetters: PropTypes.number.isRequired,
  }).isRequired,
  salonSearchHeaderActions: PropTypes.shape({
    setShowFilter: PropTypes.func.isRequired,
    setSelectedFilter: PropTypes.func.isRequired,
    setSearchText: PropTypes.func.isRequired,
  }).isRequired,
  clearSearch: PropTypes.func,
  subTitle: PropTypes.string,
  leftButtonOnPress: PropTypes.func,
  title: PropTypes.string.isRequired,
  leftButton: PropTypes.node,
};

SalonSearchHeader.defaultProps = {
  hasFilter: true,
};
export default SalonSearchHeader;
