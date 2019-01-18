import * as React from 'react';
import { Text, TextInput, View, StyleSheet, ViewPropTypes, RegisteredStyle } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import Icon from '@/components/common/Icon';
import SalonTouchableHighlight from './SalonTouchableHighlight';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    height: 36,
    flex: 4,
  },
  searchIconRight: {
    fontSize: 15,
    marginRight: 10,
    textAlign: 'center',
  },
  searchIconLeft: {
    fontSize: 15,
    marginLeft: 8,
    textAlign: 'center',
  },
  searchBarInput: {
    height: 35,
    flex: 7,
    borderColor: 'transparent',
    marginLeft: 10,
  },
  searchBarItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelSearchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelSearch: {
    fontSize: 14,
    fontFamily: 'Roboto',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  crossIcon: {
    fontSize: 12,
    marginRight: 10,
    textAlign: 'center',
    fontWeight: '700',
  },
  crossIconButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class SalonSearchBar extends React.Component {
  state = {
    searchText: '',
  };

  blurInput = () => {
    this.textInput.blur();
  };

  handleChange = searchText => {
    this.setState({ searchText }, () => {
      if (this.props.onChangeText) {
        this.props.onChangeText(searchText);
      }
    });
  };

  handleCancel = () => {
    this.handleChange('');
    this.textInput.blur();
    if (isFunction(this.props.handleCancel)) {
      this.props.handleCancel();
    }
  };

  clearSearchText = () => {
    this.textInput.blur();
    this.handleChange('');
  };

  setRef = ref => this.textInput = ref;

  onBlur = () => {
    this.clearSearchText();
    this.props.onBlur();
  };

  render () {
    const {
      iconsColor,
      borderColor,
      backgroundColor,
      containerColor,
      focusOnMount,
      fontColor,
      showCancel,
      searchIconPosition,
      onClear,
    } = this.props;
    const { searchText } = this.state;
    const searchBarStyle = {
      borderColor,
      backgroundColor,
    };
    const containerStyle = containerColor
      ? {
        backgroundColor: containerColor,
      }
      : {};
    const searchIconStyle = { color: iconsColor };
    const textInputStyle = { color: fontColor };
    return (
      <View
        style={[styles.container, containerStyle, this.props.containerStyle]}
      >
        <NavigationEvents
          onWillFocus={payload =>
            this.props.focusOnMount && this.textInput.focus()}
        />
        <View style={[styles.searchBar, searchBarStyle]}>
          <View style={styles.searchBarItems}>
            {searchIconPosition === 'left' &&
              <Icon
                style={[styles.searchIconLeft, searchIconStyle]}
                name="search"
              />}
            <TextInput
              ref={this.setRef}
              style={[styles.searchBarInput, textInputStyle]}
              placeholder={this.props.placeHolderText}
              placeholderTextColor={this.props.placeholderTextColor}
              onChangeText={this.handleChange}
              value={searchText}
              onFocus={this.props.onFocus}
              onBlur={this.onBlur}
            />
            {searchText.length === 0 &&
              searchIconPosition === 'right' &&
              <Icon
                style={[styles.searchIconRight, searchIconStyle]}
                name="search"
              />}
            <View style={styles.crossIconContainer}>
              {searchText.length > 0 &&
                <SalonTouchableHighlight
                  underlayColor="transparent"
                  onPress={this.clearSearchText}
                  style={styles.crossIconButton}
                >
                  <Icon
                    name="timesCircle"
                    style={[styles.crossIcon, searchIconStyle]}
                  />
                </SalonTouchableHighlight>}
            </View>
          </View>
        </View>
        {showCancel &&
          <View style={styles.cancelContainer}>
            <SalonTouchableHighlight
              style={styles.cancelSearchContainer}
              underlayColor="transparent"
              onPress={this.handleCancel}
            >
              <Text style={[styles.cancelSearch, textInputStyle]}>Cancel</Text>
            </SalonTouchableHighlight>
          </View>}
      </View>
    );
  }
}

SalonSearchBar.propTypes = {
  placeholderTextColor: PropTypes.string,
  fontColor: PropTypes.string,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  iconsColor: PropTypes.string,
  searchIconPosition: PropTypes.string,
  showCancel: PropTypes.bool,
  placeHolderText: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func.isRequired,
  focusOnMount: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  onClear: PropTypes.func,
};

SalonSearchBar.defaultProps = {
  placeholderTextColor: '#FFFFFF',
  fontColor: '#FFFFFF',
  borderColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
  iconsColor: '#FFFFFF',
  searchIconPosition: 'left',
  showCancel: false,
  placeHolderText: 'Search',
  onFocus: () => {},
  onBlur: () => {},
  onClear: () => {},
  focusOnMount: false,
  containerStyle: {},
};

export default SalonSearchBar;
