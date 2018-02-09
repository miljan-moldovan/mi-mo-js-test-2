import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import SideMenuItem from '../../components/SideMenuItem';

const services = require('../../mockData/services.json');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold',
    // padding: 20,
    marginTop: 20,
    marginBottom: 4,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 12,

  },
  seachBar: {
    flexDirection: 'row',
    flex: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  loginButton: {
    width: 250,
    height: 65,
    marginTop: 17,
    marginBottom: 18,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItemInactive: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,.2)',
  },
  listItemActive: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'rgba(29,29,38,.03)',
    borderLeftWidth: 6,
    borderLeftColor: '#00B782',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,.2)',
  },
  listText: {
    fontSize: 18,
    color: '#242424',
  },
  durationText: {
    fontSize: 12,
    color: '#3D3C3B',
    opacity: 0.5,
  },
  caretIcon: {
    height: 12,
    width: 6,
    alignSelf: 'flex-end',
  },
  sectionNavigate: {
    height: 50,
    alignSelf: 'stretch',
    padding: 10,
    borderBottomWidth: 3,
    backgroundColor: '#F3F3F4',
    borderBottomColor: 'rgba(5,5,5,.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});


class ServicesScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Services"
        icon={require('../../assets/images/sidemenu/icon_sales_menu.png')}
      />
    ),
  };

  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);

    this.state = {
      activeListItem: null,
      activeData: null,
      storedData: null,
      parentList: null,
    };
  }

  componentWillMount() {
    this.setState({ activeData: services });
  }

  mapData(data, parent = false) {
    return data.map((item) => {
      const mapped = {
        data: item,
        key: item.id,
      };

      for (key in item) {
        if (typeof item[key] === 'object') {
          mapped.data.children = this.mapData(item[key]);
        }
      }

      return mapped;
    });
  }

  hasMappedChildren(data) {
    for (key in data) {
      if (typeof data[key] === 'object') {
        if (typeof data[key].data !== undefined && typeof data[key].key !== undefined) { return true; }
      }
    }

    return false;
  }

  _filterServices(searchText) {
    if (searchText.length === 0) {
      this.setState({ activeData: this.state.storedData, storedData: null, searchText });
    } else {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
      ];

      const toStore = this.state.storedData === null ? this.state.activeData : this.state.storedData;

      const filtered = this.flexFilter(toStore, criteria);

      this.setState({ storedData: toStore, searchText, activeData: filtered });
    }
  }

  flexFilter(list, info) {
    let matchesFilter,
      matches = [];

    matchesFilter = function (item) {
      let count = 0;
      for (let n = 0; n < info.length; n++) {
        if (item.data[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count++;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i++) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }
  _handleOnChangeService = (service) => {
    console.log('service', service);
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeService, dismissOnSelect } = this.props.navigation.state.params;
    if (onChangeService)
      onChangeService(service);
    if (dismissOnSelect)
      this.props.navigation.goBack();
  }
  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={item.id === this.state.activeListItem ? styles.listItemActive : styles.listItemInactive}
      onPress={() => {
        const { navigate } = this.props.navigation;
        const {params} = this.props.navigation.state;
        if (this.hasMappedChildren(item)) {
          this.setState({
            prevData: this.state.activeData,
            activeData: item.services,
            parentList: item,
          });

          this.props.walkInActions.setCurrentStep(2);
        } else {
          if (params && params.onChangeService) {
            this._handleOnChangeService(item);
          } else {
            this.props.walkInActions.selectService(item);
            if(params !== undefined && params.actionType === 'update') {
              navigate('WalkIn');
            } else {
              this.props.walkInActions.setCurrentStep(3);
              navigate('Providers');
            }
          }

        }
        this.setState({ activeListItem: item.id });
      }}
      key={index}
      underlayColor="#ffffff"
      activeOpacity={2}
    >
      <View>
        <View style={{
          flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={item.id === this.state.activeListItem ? [styles.listText, { fontFamily: 'OpenSans-Bold' }] : styles.listText}>{item.name}</Text>
            { item.duration !== undefined && <Text style={styles.durationText}>{item.duration}m</Text>}
          </View>
          { item.services !== undefined ? (
            <Image style={styles.caretIcon} source={require('../../assets/images/icons/icon_caret_right.png')} />
            ) : null }
        </View>
      </View>
    </TouchableOpacity>
  );

  renderList() {
    if (this.state.parentList !== null) {
      return (
        <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                prevData: this.state.activeData,
                activeData: this.state.prevData,
                parentList: null,
              });
            }}
            underlayColor="#ffffff"
            activeOpacity={2}
          >
            <View style={styles.sectionNavigate}>
              <View style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                }}
              >
                <Image style={[styles.caretIcon, { alignSelf: 'center', marginRight: 5 }]} source={require('../../assets/images/icons/icon_caret_left.png')} />
                <Text style={{
                  fontFamily: 'OpenSans-SemiBold', fontSize: 13, alignSelf: 'center', lineHeight: 25,
                  }}
                >{this.state.parentList.name.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <FlatList
            style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}
            data={this.state.activeData}
            renderItem={this._renderItem}
            // keyExtractor={this._keyExtractor}
          />
        </View>
      );
    }
    return (
      <FlatList
        style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}
        data={this.state.activeData}
        renderItem={this._renderItem}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {this.renderList()}
        </View>
      </View>
    );
  }
}
export default ServicesScreen;
