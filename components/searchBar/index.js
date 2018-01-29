import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableHighlight, View, StyleSheet } from 'react-native';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.searchText = '';
    this.state = {placeholder: props.placeholder};
  }

  state = {
    isVisible: null,
    placeholder: '',
  }

  componentWillMount() {
    this.setState({isVisible: this.props.isVisible, searchText: ''})
  }

  handleChange= searchText => {
      this.setState({searchText});
      if(this.props.onChangeText) this.props.onChangeText(searchText);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <View style={styles.searchBarItems}>
            {this.props.searchIconPosition === 'left' &&
              <Image style={styles.searchIconLeft} source={require('../../assets/images/clientsSearch/icon_search_w.png')} />
            }
            <TextInput
              style={styles.searchBarInput}
              placeholder={this.state.placeholder}
              placeholderTextColor='rgba(255,255,255, 0.6)'
              onChangeText={this.handleChange}
              value={this.state.searchText}
            />
            {this.props.searchIconPosition === 'right' &&
              <Image style={styles.searchIconRight} source={require('../../assets/images/clientsSearch/icon_search_w.png')} />
            }


            <View style={styles.crossIconContainer}>
              {this.searchText.length > 0 &&

                <TouchableHighlight
                  style={styles.crossIconButton}
                  underlayColor="transparent"
                  onPress={
                    () => {
                      this.searchText = '';
                      if(this.props.onChangeText) this.props.onChangeText('');
                    }
                  }>
                  <Image style={styles.crossIcon} source={require('../../assets/images/clientsSearch/icon_cross.png')} />
                </TouchableHighlight>

              }
            </View>
          </View>
        </View>
          {this.props.showCancel &&
              <View>
                <TouchableHighlight
                  style={styles.cancelSearchContainer}
                  underlayColor="transparent"
                  onPress={
                    () => {
                      this.searchText = '';
                      if(this.props.onChangeText) this.props.onChangeText('');
                    }
                  }>
                  <Text style={styles.cancelSearch}>Cancel</Text>
                </TouchableHighlight>
              </View>
          }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  searchBar: {
    borderColor: 'rgba(255,255,255, 0.6)',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255, 0.20)',
    borderRadius: 30,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    height: 30,
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
    color: 'white',
    marginLeft: 10,
  },
  searchBarItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelSearchContainer:{
    marginVertical: 15,
    marginHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelSearch:{
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  crossIcon:{
    width: 16,
    height: 16,
    marginRight: 15,
    paddingTop: 1
  },
  crossIconButton:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  crossIconContainer:{
    flex: 0.5
  }
})
