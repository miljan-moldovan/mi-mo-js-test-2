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
import * as actions from '../actions/providers.js';
import SideMenuItem from '../components/SideMenuItem';
import ImageWrapper from '../components/imageWrapper';

import { LargeList } from "react-native-largelist";

let mockDataProviders = require('../mockData/providers.json')

class ProvidersScreen extends React.Component {

  largeList: LargeList;

  static navigationOptions = {
    drawerLabel: (props) => (
      <SideMenuItem
        {...props}
        title="Providers"
        icon={require('../assets/images/sidemenu/icon_appoint_menu.png')} />
    ),
  };
  state = {

  }

  constructor(props) {
    super(props);
    this.state = {providers: mockDataProviders.data};
  }

  renderItem(section: number, row: number) {
      let provider = this.state.providers[row];

      let fullName = provider.name;
      fullName += provider.middleName ? ' ' + provider.middleName +  provider.lastName : ' ' + provider.lastName;
      let price = '$30.00';
      let minutes = 9;

      return (
          <TouchableHighlight
              style={styles.provider}
              underlayColor="transparent"
              onPress={() => {}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                 <View style={styles.providerImageContainer}>
                   <View style={styles.providerRound}>
                     <ImageWrapper imageStyle={styles.providerImage} image={{uri: provider.imagePath}}/>
                   </View>
                 </View>
                 <View style={styles.providerData}>
                  <Text style={styles.providerName}>{fullName}</Text>
                  <Text style={styles.providerPrice}>{price}</Text>
                 </View>
                 <View style={styles.providerTime}>
                  <Text style={styles.providerWaiting}>Waiting</Text>
                  <Text style={styles.providerMinutes}>{minutes}</Text>
                  <Text style={styles.providerMin}>min</Text>
                 </View>
              </View>
            </TouchableHighlight>
      );
    }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.providerListContainer}>
        <TouchableHighlight
            style={styles.firstAvailableButton}
            underlayColor="transparent"
            onPress={() => {}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
               <View style={styles.firstAvailableImageContainer}>
                 <View style={styles.firstAvailable}>
                  <Text style={styles.firstAvailableText}>FA</Text>
                 </View>
               </View>
               <View style={styles.providerData}>
                <Text style={styles.providerName}>First Available</Text>
               </View>
               <View style={styles.providerTime}>
                <Text style={styles.providerWaiting}>Waiting</Text>
                <Text style={styles.providerMinutes}>9</Text>
                <Text style={styles.providerMin}>min</Text>
               </View>
            </View>
          </TouchableHighlight>
          <LargeList
            style={styles.providersList}
            ref={ref => (this.largeList = ref)}
            numberOfRowsInSection={() => this.state.providers.length}
            heightForCell={() => 80}
            renderCell={this.renderItem.bind(this)}
            renderEmpty={() =>
              <View
                style={{
                  height: '100%',
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text>Empty</Text>
              </View>}
              renderItemSeparator={()=> <View style={styles.itemSeparator} /> }
          />
        </View>
      </View>
    );
  }
}
export default connect(null, actions)(ProvidersScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        flexDirection: 'column'
    },
    itemSeparator:{
      backgroundColor: "#EEE",
      //height: 1
    },
    providerListContainer:{
        flex:9,
        backgroundColor: '#FFF',
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
    providersHeader:{
        flex:1.6,
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        flexDirection: 'column'
    },
    providersHeaderTopSection:{
      flex: 1,
      flexDirection: 'row'
    },
    cancelIconContainer:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cancelText:{
      marginTop: 20,
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'OpenSans-Bold',
      backgroundColor: 'transparent'
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
    headerSubTitle:{
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'OpenSans-Regular',
      backgroundColor: 'transparent'
    },
    newProviderContainer:{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    providersList:{
      backgroundColor: '#FFF',
      flex: 1
    },
    provider:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(0,0,0,0.2)'
    },
    providerImageContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    providerRound:{
      flex: 1/2,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginLeft:10,
    },
    providerImage:{
      borderRadius: 22,
      height: 44,
      width: 44,
    },
    providerData:{
        marginLeft:15,
        flex: 2,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    providerTime:{
        marginLeft:20,
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: 'column'
    },
    providerName: {
        color: '#1D1D26',
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
        backgroundColor: 'transparent'
    },
    providerPrice: {
        color: '#3D3C3B',
        fontSize: 12,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent'
    },
    providerWaiting: {
        color: '#3D3C3B',
        fontSize: 10,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent'
    },
    providerMinutes: {
        color: '#1D1D26',
        fontSize: 30,
        fontFamily: 'OpenSans-Regular',
        backgroundColor: 'transparent'
    },
    providerMin: {
        color: '#3D3C3B',
        fontSize: 10,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent'
    },
    firstAvailableText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        backgroundColor: 'transparent'
    },
    firstAvailable:{
      backgroundColor: '#67A3C7',
      borderRadius: 22,
      height: 44,
      width: 44,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    firstAvailableButton:{
      flex: 1/6,
      flexDirection: 'row',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(0,0,0,0.2)'
    },
    firstAvailableImageContainer:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }
});
