// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SectionList,
  TouchableHighlight
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../actions/login.js';
import SideMenuItem from '../components/SideMenuItem';
import SearchBar from '../components/SearchBar';

const services = {
  "data": [{
    "id": 1,
    "name": "Adult",
    "services": [{
      "id": 4,
      "name": "Service 1",
      "duration": 20
    }, {
      "id": 5,
      "name": "Service 2",
      "duration": 10
    }]
  }, {
    "id": 2,
    "name": "Kid",
    "services": [{
      "id": 6,
      "name": "Service 1",
      "duration": 20
    }, {
      "id": 7,
      "name": "Service 2",
      "duration": 10
    }]
  }, {
    "id": 3,
    "name": "None",
    "services": [{
      "id": 8,
      "name": "Service 1",
      "duration": 20
    }, {
      "id": 9,
      "name": "Service 2",
      "duration": 10
    }]
  }]
};

class ServicesScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: (props) => (
      <SideMenuItem
        {...props}
        title="Services"
        icon={require('../assets/images/sidemenu/icon_sales_menu.png')} />
    ),
  };

  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);

    this.state = {
      steps: ["Select Category", "Select Service", "Select Provider", "Add Product"],
      currentStep: 0,
      activeListItem: null,
      activeData: null,
      storedData: null,
      parentList: null,

    }
  }
  
  componentWillMount() {
    this.setState({activeData: this.mapData(services.data)});
  }

  mapData(data, parent = false) {
    return data.map(item => {
      let mapped = {
        data: item,
        key: item.id,
        // renderItem: this._renderItem,
      }

      for(key in item) {
        if(typeof item[key] === "object") {
          mapped.data.children = this.mapData(item[key]);
        }
      }

      return mapped;
    });
  }

  hasMappedChildren(data) {
    for(key in data) {
      if(typeof data[key] === "object") {
        if(typeof data[key].data !== undefined && typeof data[key].key !== undefined)
          return true
      }
    }

    return false;
  }

  _filterServices(searchText) {
     if(searchText.length === 0 ){
       this.setState({activeData: this.state.storedData, storedData: null, searchText: searchText});
     }else{
       var criteria = [
         { Field: "name", Values: [searchText.toLowerCase()] }
       ];

        const toStore = this.state.storedData === null ? this.state.activeData : this.state.storedData;

        var filtered = this.flexFilter(toStore, criteria);       
  
       this.setState({storedData: toStore, searchText: searchText, activeData: filtered});
     }
   }
  
   flexFilter(list, info) {
  
     var matchesFilter, matches = [];
  
     matchesFilter = function(item) {
       let count = 0;
       for (var n = 0; n < info.length; n++) {
         if (item.data[info[n]["Field"]].toLowerCase().indexOf(info[n]["Values"]) > -1) {
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

  _renderItem = ({item, index}) => {
    const { data, key } = item;

    return (
      <TouchableHighlight
        style={data.id === this.state.activeListItem ? styles.listItemActive : styles.listItemInactive}
        onPress={e => {
          if(this.hasMappedChildren(data)) {
            this.setState({
              prevData: this.state.activeData,
              activeData: data.children,
              parentList: data,
              currentStep: this.state.currentStep + 1,
            });
          }
          this.setState({activeListItem: data.id});
        }}
        underlayColor="#ffffff"
        activeOpacity={2}
      >
        <View>
          <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <View style={{flex: 1, flexDirection: "column"}}>  
              <Text style={data.id === this.state.activeListItem ? [styles.listText, {fontFamily: "OpenSans-Bold"}] : styles.listText}>{data.name}</Text>
                { data.duration !== undefined && <Text style={styles.durationText}>{data.duration}m</Text>}
                </View>
              { this.hasMappedChildren(data) ? (
                <Image style={styles.caretIcon} source={require('../assets/images/icons/icon_caret_right.png')} />
              ) : null }
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderList() {
    if(this.state.parentList !== null) {
      return (
        <View style={{flex: 1, alignSelf: "stretch", backgroundColor: "white"}}>
          <TouchableHighlight
            onPress={e => {
              this.setState({
                prevData: this.state.activeData,                
                activeData: this.state.prevData,
                parentList: null,
                currentStep: this.state.currentStep - 1,
              });
            }}
            underlayColor="#ffffff"
            activeOpacity={2}
          >
            <View style={styles.sectionNavigate}>
              <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                <Image style={[styles.caretIcon, {alignSelf: "center", marginRight: 5}]} source={require('../assets/images/icons/icon_caret_left.png')} />
                <Text style={{fontFamily: "OpenSans-SemiBold", fontSize: 13, alignSelf: "center", lineHeight: 25}}>{this.state.parentList.name.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableHighlight>
          <FlatList
            style={{flex: 1, alignSelf: "stretch", backgroundColor: "white"}}
            data={this.state.activeData}
            renderItem={this._renderItem}
            // keyExtractor={this._keyExtractor}
          />
        </View>
      );
    } else {
      return (
        <FlatList
          style={{flex: 1, alignSelf: "stretch", backgroundColor: "white"}}
          data={this.state.activeData}
          renderItem={this._renderItem}
          // keyExtractor={this._keyExtractor}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')} />
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.state.steps[this.state.currentStep]}</Text>
            <Text style={styles.subTitle}>Walkin Service - {this.state.currentStep + 1} of {this.state.steps.length}</Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View style={{flex: 1, flexDirection: "row"}}>
            <SearchBar showCancel={false} placeholder='Search by name' searchIconPosition='right' style={styles.seachBar} onChangeText={(searchText) => {this._filterServices(searchText)}}/>
          </View>
        </View>
        <View style={styles.searchContainer}>

        </View>
        <View style={styles.listContainer}>
          {this.renderList()}
        </View>
      </View>
    );
  }
}
export default connect(null, actions)(ServicesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold',
    // padding: 20,
    marginTop: 20,
    marginBottom: 4,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    color: "#ffffff",
    fontSize: 12,

  },
  seachBar:{
    flexDirection: 'row',
    flex: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center'
  },
  loginButton: {
    width: 250,
    height: 65,
    marginTop: 17,
    marginBottom: 18,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center'
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  listItemInactive: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(29,29,38,.2)",
  },
  listItemActive: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "rgba(29,29,38,.03)",
    borderLeftWidth: 6,
    borderLeftColor: "#00B782",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(29,29,38,.2)"
  },
  listText: {
    fontSize: 18,
    color: "#242424"
  },
  durationText: {
    fontSize: 12,
    color: "#3D3C3B",
    opacity: 0.5,
  },
  caretIcon: {
    height: 12,
    width: 6,
    alignSelf: "flex-end"
  },
  sectionNavigate: {
    height: 50,
    alignSelf: "stretch",
    padding: 10,
    borderBottomWidth: 3,
    backgroundColor: "#F3F3F4",
    borderBottomColor: "rgba(5,5,5,.1)",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center"
  },
});
