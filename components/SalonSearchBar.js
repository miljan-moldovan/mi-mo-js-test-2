import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Icon from './../components/UI/Icon';
import SalonTouchableHighlight from './../components/SalonTouchableHighlight';

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

class SalonSearchBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({ searchText: '' });
  }

  componentDidMount() {
    if (this.props.focusOnMount) {
      textInput.focus();
    }
  }


  handleChange= (searchText) => {
    if (searchText.length > 2 && this.props.onChangeText) {
      this.props.onChangeText(searchText);
    }
    this.setState({ searchText });
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.searchBar,
          {
          backgroundColor: this.props.backgroundColor,
          borderColor: this.props.borderColor,

          },
        ]}
        >
          <View style={styles.searchBarItems}>
            {this.props.searchIconPosition === 'left' &&

            <Icon
              style={[styles.searchIconLeft,
            { color: this.props.iconsColor }]}
              name="search"
            />


            }
            <TextInput
              ref={ref => textInput = ref}
              focusOnMount={this.props.focusOnMount}
              style={[styles.searchBarInput, { color: this.props.fontColor }]}
              placeholder={this.props.placeHolderText}
              placeholderTextColor={this.props.placeholderTextColor}
              onChangeText={this.handleChange}
              value={this.state.searchText}
              onFocus={this.props.onFocus}
            />
            {this.state.searchText.length === 0 && this.props.searchIconPosition === 'right' &&

              <Icon
                style={[styles.searchIconRight, { color: this.props.iconsColor }]}
                name="search"
              />

            }


            <View style={styles.crossIconContainer}>
              {this.state.searchText.length > 0 &&

                <SalonTouchableHighlight
                  style={styles.crossIconButton}
                  underlayColor="transparent"
                  onPress={
                    () => {
                      this.handleChange('');
                    }}
                >

                  <Icon
                    style={[styles.crossIcon,
                    { color: this.props.iconsColor }]}
                    name="timesCircle"
                  />

                </SalonTouchableHighlight>

              }
            </View>
          </View>
        </View>
        {this.props.showCancel &&
          <View style={styles.cancelContainer}>
            <SalonTouchableHighlight
              style={styles.cancelSearchContainer}
              underlayColor="transparent"
              onPress={
                () => {
                  this.handleChange('');
                }
              }
            >
              <Text style={[styles.cancelSearch, { color: this.props.fontColor }]}>Cancel</Text>
            </SalonTouchableHighlight>
          </View>
          }
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
  onChangeText: PropTypes.func.isRequired,
  focusOnMount: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
};

SalonSearchBar.defaultProps = {
  placeholderTextColor: '#FFFFFF',
  fontColor: '#FFFFFF',
  borderColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
  iconsColor: '#FFFFFF',
  searchIconPosition: 'left',
  showCancel: false,
  placeHolderText: 'Search1',
  onFocus: () => {},
  focusOnMount: false,
  containerStyle: {},
};

export default SalonSearchBar;
