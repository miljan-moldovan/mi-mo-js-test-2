import React, { Component } from 'react';
import { Text, TextInput, TouchableHighlight, View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    marginLeft: 10,
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
    fontSize: 15,
    fontFamily: 'Roboto',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  crossIcon: {
    fontSize: 15,
    marginRight: 10,
    textAlign: 'center',
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
    this.setState({ searchText });
    if (this.props.onChangeText) this.props.onChangeText(searchText);
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

            <FontAwesome style={[styles.searchIconLeft,
            { color: this.props.iconsColor }]}
            >{Icons.search}
            </FontAwesome>


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

              <FontAwesome style={[styles.searchIconRight,
                            { color: this.props.iconsColor }]}
              >{Icons.search}
              </FontAwesome>

            }


            <View style={styles.crossIconContainer}>
              {this.state.searchText.length > 0 &&

                <TouchableHighlight
                  style={styles.crossIconButton}
                  underlayColor="transparent"
                  onPress={
                    () => {
                      this.handleChange('');
                    }}
                >

                  <FontAwesome style={[styles.crossIcon,
                    { color: this.props.iconsColor }]}
                  >{Icons.timesCircle}
                  </FontAwesome>

                </TouchableHighlight>

              }
            </View>
          </View>
        </View>
        {this.props.showCancel &&
          <View style={styles.cancelContainer}>
            <TouchableHighlight
              style={styles.cancelSearchContainer}
              underlayColor="transparent"
              onPress={
                () => {
                  this.handleChange('');
                }
              }
            >
              <Text style={[styles.cancelSearch, { color: this.props.fontColor }]}>Cancel</Text>
            </TouchableHighlight>
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
