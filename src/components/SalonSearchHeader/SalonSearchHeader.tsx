import * as React from 'react';
import { View, ViewPropTypes, Text, LayoutAnimation } from 'react-native';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import SalonSearchBar from '../SalonSearchBar';
import SalonFlatPicker from '../SalonFlatPicker';
import SalonTouchableOpacity from '../SalonTouchableOpacity';

import styles from './styles';
import Colors from '@/constants/Colors';

class SalonSearchHeader extends React.Component<any, any> {
  private searchBar: any;
  private debouncedOnChange: any;

  static propTypes = {
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

  static defaultProps = {
    headerContainerStyle: {},
    subTitle: '',
    leftButtonOnPress: () => {},
    leftButton: null,
    clearSearch: () => {},
    hasFilter: true,
  };

  constructor(props) {
    super(props);
    this.debouncedOnChange = debounce(this.onChangeText, 500);
  }

  componentWillUnmount() {
    const { salonSearchHeaderActions: { setSearchText } } = this.props;
    setSearchText('');
  }

  onChangeText = searchText => {
    if (
      searchText.length >
      this.props.salonSearchHeaderState.ignoredNumberOfLetters
    ) {
      this.props.salonSearchHeaderActions.setSearchText(searchText);
      this.props.salonSearchHeaderState.filterList(searchText);
    }
    if (searchText && searchText.length > 0) {
      this.props.salonSearchHeaderActions.setShowFilter(true);
    }
  };

  onInputBlur = () => {
    const {
      salonSearchHeaderState: { searchText, showFilter },
      salonSearchHeaderActions: { setShowFilter },
    } = this.props;
    if (showFilter) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    if (searchText.length === 0 && showFilter) {
      setShowFilter(false);
    }
  };

  handleTypeChange = (ev, selectedIndex) => {
    this.props.salonSearchHeaderActions.setSelectedFilter(selectedIndex);
  };

  showSuggestions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.props.salonSearchHeaderActions.setShowFilter(true);
  };

  handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.props.salonSearchHeaderActions.setShowFilter(false);
    this.props.salonSearchHeaderActions.setSearchText('');
    if (this.props.clearSearch) {
      this.props.clearSearch();
    }
  };

  render () {
    return (
      <View style={[styles.headerContainer, this.props.headerContainerStyle]}>
        {
          !this.props.salonSearchHeaderState.showFilter &&
            <View style={styles.header}>
              <SalonTouchableOpacity
                style={styles.styleForTouchableView}
                onPress={this.props.leftButtonOnPress}
              >
                {this.props.leftButton}
              </SalonTouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{this.props.title}</Text>
                {
                  this.props.subTitle ? <Text style={styles.subTitleText}>{this.props.subTitle}</Text> : null
                }
              </View>
              <View style={styles.rightButton}>
                {
                  this.props.rightButton
                    ? <SalonTouchableOpacity
                        style={styles.styleForTouchableView}
                        onPress={this.props.rightButtonOnPress}
                    >
                      {this.props.rightButton}
                    </SalonTouchableOpacity>
                    : null
                }
              </View>
            </View>
        }
        <View
          style={[
            styles.topSearchBar,
            {
              paddingTop: !this.props.salonSearchHeaderState.showFilter ? 0 : 8,
              backgroundColor: !this.props.salonSearchHeaderState.showFilter ? '#F1F1F1' : '#115ECD',
            },
          ]}
        >
          <SalonSearchBar
            placeHolderText="Search"
            containerStyle={[
              styles.searchBar,
              {
                paddingLeft: !this.props.salonSearchHeaderState.showFilter ? 7 : 8,
                paddingRight: !this.props.salonSearchHeaderState.showFilter ? 7 : 2,
              },
            ]}
            marginVertical={0}
            placeholderTextColor={!this.props.salonSearchHeaderState.showFilter ? Colors.defaultGrey : Colors.white}
            showCancel={this.props.salonSearchHeaderState.showFilter}
            searchIconPosition="left"
            iconsColor={!this.props.salonSearchHeaderState.showFilter ? Colors.defaultGrey : Colors.white}
            fontColor={!this.props.salonSearchHeaderState.showFilter ? Colors.defaultGrey : Colors.white}
            borderColor="transparent"
            backgroundColor={
              !this.props.salonSearchHeaderState.showFilter
                ? Colors.searchBarBackground
                : Colors.darkBlue
            }
            containerColor={!this.props.salonSearchHeaderState.showFilter ? Colors.lightGrey : Colors.defaultBlue}
            onChangeText={this.debouncedOnChange}
            onFocus={this.showSuggestions}
            onBlur={this.onInputBlur}
            handleCancel={this.handleCancel}
            onClear={this.onInputBlur}
            focusOnMount={this.props.focusOnMount}
            ref={ref => this.searchBar = ref}
          />
        </View>
        {
          this.props.hasFilter && this.props.salonSearchHeaderState.showFilter &&
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
