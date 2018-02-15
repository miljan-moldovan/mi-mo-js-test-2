import React, { Component } from 'react';
import { Text, TextInput, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonIcon from '../components/SalonIcon';


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
    height: 35,
    flex: 4,
  },
  searchIconRight: {
    width: 13,
    height: 16,
    marginRight: 15,
    paddingTop: 1,
    resizeMode: 'contain',
  },
  searchIconLeft: {
    width: 13,
    height: 16,
    marginLeft: 15,
    paddingTop: 1,
    resizeMode: 'contain',
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
    fontSize: 16,
    fontFamily: 'Roboto',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  crossIcon: {
    width: 16,
    height: 16,
    marginRight: 15,
    paddingTop: 1,
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
    this.searchText = '';
  }

  componentWillMount() {
    this.setState({ searchText: '' });
  }

  handleChange= (searchText) => {
    this.setState({ searchText });
    if (this.props.onChangeText) this.props.onChangeText(searchText);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.searchBar,
          {
          backgroundColor: this.props.backgroundColor,
          borderColor: this.props.borderColor,

          },
        ]}
        >
          <View style={styles.searchBarItems}>
            {this.props.searchIconPosition === 'left' &&

            <SalonIcon
              size={16}
              icon="search"
              style={[styles.searchIconLeft,
              { tintColor: this.props.iconsColor }]}
            />
            }
            <TextInput
              style={[styles.searchBarInput, { color: this.props.fontColor }]}
              placeholder={this.props.placeHolderText}
              placeholderTextColor={this.props.placeholderTextColor}
              onChangeText={this.handleChange}
              value={this.state.searchText}
            />
            {this.state.searchText.length === 0 && this.props.searchIconPosition === 'right' &&

              <SalonIcon
                size={15}
                icon="caretRight"
                style={[styles.searchIconRight,
              { tintColor: this.props.iconsColor }]}
              />
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

                  <SalonIcon
                    size={16}
                    icon="cross"
                    style={[styles.crossIcon,
                    { tintColor: this.props.iconsColor }]}
                  />
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
};

export default SalonSearchBar;
