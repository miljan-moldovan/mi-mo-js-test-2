// @flow
import React from 'react';
import {
  Image,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../actions/login.js';
import SideMenuItem from '../components/SideMenuItem';
import ClientList from '../components/clientList';
import SearchBar from '../components/searchBar';
import ImageWrapper from '../components/imageWrapper';
import WordHighlighter from '../components/wordHighlighter';

let mockDataClients = require('../mockData/clients.json')

class ClientsSearchScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: (props) => (
      <SideMenuItem
        {...props}
        title="Clients"
        icon={require('../assets/images/sidemenu/icon_appoint_menu.png')} />
    ),
  };
  state = {

  }

  constructor(props) {
    super(props);
    this.state = {clients: mockDataClients, searchText: '', showWalkIn: false };
  }


  componentWillMount(){

    this.setState({filteredClients: this.state.clients});

  }

  _filterClients(searchText){

    if(searchText.length === 0 ){
      this.setState({filteredClients: this.state.clients, searchText:searchText});
    }else{
      var criteria = [
        { Field: "name", Values: [searchText.toLowerCase()] },
        { Field: "email", Values: [searchText.toLowerCase()] }
      ];
      var filtered = this.flexFilter(this.state.clients, criteria);

      var filterWalkin = this.flexFilter([{name: 'Walkin', email: 'Walkin'}], criteria);

      this.setState({filteredClients: filtered, searchText:searchText, showWalkIn: filterWalkin.length > 0});
    }
  }

  flexFilter(list, info) {

    var matchesFilter, matches = [];

    matchesFilter = function(item) {
      let count = 0;
      for (var n = 0; n < info.length; n++) {
        if (item[info[n]["Field"]].toLowerCase().indexOf(info[n]["Values"]) > -1) {
          count++;
        }
      }
      return count > 0;
    }

    for (var i = 0; i < list.length; i++) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')} />
        <View style={styles.phoneToolBar}>
        </View>
        <View style={styles.clientsHeader}>
          <View style={styles.clientsHeaderTopSection}>
            <View style={styles.backIconContainer}>
              <TouchableHighlight
                style={styles.backButton}
                underlayColor="transparent"
                onPress={() => {this.setState({searchText:'', filteredClients: this.state.clients});}}>
                <View style={styles.backButtonCoontainer}>
                  <Image style={styles.backIcon} source={require('../assets/images/clientsSearch/icon_arrow_left_w.png')} />
                  <Text style={styles.backText}>Back</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Client Search</Text>
            </View>
            <View style={styles.newClientContainer}>
              <TouchableHighlight
                style={styles.newClientButton}
                underlayColor="transparent"
                onPress={() => {this.setState({searchText:'', filteredClients: this.state.clients});}}>
                <Text style={styles.newClient}>New Client</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.clientsBarBottomSection}>
            <SearchBar showCancel={true} placeholder='' searchIconPosition='left' style={styles.seachBar} onChangeText={(searchText) => {this._filterClients(searchText)}}/>
          </View>
        </View>

        <View style={styles.clientsList}>
          {this.state.filteredClients.length > 0 &&
            <View style={styles.topSearchBar}>
                <Text style={styles.topSearchBarText}>TOP SEARCH MATCHES</Text>
             </View>}
          {this.state.showWalkIn && <View style={styles.walkinBar}>
                <View style={styles.walkinBarIconContainer}>
                  <View style={styles.walkinBarRound}>
                    <ImageWrapper imageStyle={styles.walkinBarIcon} image={require('../assets/images/clientsSearch/icon_walkin.png')}/>
                  </View>
                </View>

                <View style={styles.walkinBarData}>

                <TouchableHighlight
                  style={styles.newClientButton}
                  underlayColor="transparent"
                  onPress={() => {}}>

                    <WordHighlighter
                    highlight={this.state.searchText}
                    highlightStyle={styles.highlightStyle}
                    style={styles.walkinBarText}>Walkin</WordHighlighter>

                </TouchableHighlight>

                </View>
             </View>
           }

           <ClientList boldWords={this.state.searchText} clients={this.state.filteredClients} style={styles.clientListContainer}/>
        </View>

      </View>
    );
  }
}
export default connect(null, actions)(ClientsSearchScreen);

const styles = StyleSheet.create({
    highlightStyle:{
        color: '#000',
        fontFamily: 'OpenSans-Bold'
    },
    walkinBar:{
        flex: 0.2,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(0,0,0,0.2)'
    },
    walkinBarIconContainer:{
        flex: 1/2,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    walkinBarIcon:{
        height: 25,
        width: 21,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    walkinBarRound:{
        backgroundColor: '#67A3C7',
        borderRadius: 28,
        height: 59,
        width: 59,
    },
    walkinBarData:{
        marginLeft:20,
        flex: 1.5,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    walkinBarText: {
        color: '#1D1D26',
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
        backgroundColor: 'transparent'
    },
    container: {
        flex: 1,
        backgroundColor: '#333',
        flexDirection: 'column'
    },
    clientListContainer:{
        flex: 1,
        backgroundColor: '#333',
        flexDirection: 'column'
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'OpenSans-Regular',
        padding: 20,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'transparent'
    },
    phoneToolBar: {
        flex:0.4,
        backgroundColor: 'rgba(0, 0, 0, 0.40)',
    },
    clientsHeader:{
        flex:1.6,
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        flexDirection: 'column'
    },
    clientsList:{
        flex:9,
        backgroundColor: 'white',
    },
    clientList:{

    },
    clientsHeaderTopSection:{
        flex: 1,
        flexDirection: 'row'
    },
    backIconContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonCoontainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitleContainer:{
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle:{
        marginTop: 20,
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'OpenSans-Bold',
        backgroundColor: 'transparent'
    },
    backText:{
        marginTop: 20,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        backgroundColor: 'transparent'
    },
    newClientContainer:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    newClient:{
        //marginTop: 20,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'OpenSans-Bold',
        backgroundColor: 'transparent',
        alignSelf : 'center',
        alignItems: 'center'
    },
    backIcon:{
        marginTop: 20,
        width: 15,
        height: 15
    },
    clientsBarBottomSection:{
        flex: 1,
        flexDirection: 'row'
    },
    seachBar:{
        flexDirection: 'row',
        flex: 4,
        marginHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    topSearchBar:{
        flex: 0.13,
        flexDirection: 'column',
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 1/2,
        borderBottomColor: 'rgba(0,0,0,0.2)'
    },
    topSearchBarText:{
        color: '#1D1D26',
        fontSize: 12,
        marginLeft: 30,
        fontFamily: 'OpenSans-Bold',
        backgroundColor: 'transparent'
    }
});
