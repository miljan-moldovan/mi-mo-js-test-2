// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import SalonTouchableHighlight from '../../components/SalonTouchableHighlight';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const promotions = require('../../mockData/promotions.json');

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
  superTitle: {
    fontSize: 14,
    color: 'rgba(29,29,38,.35)',
  },
  discountText: {
    fontSize: 18,
    color: 'rgba(29,29,38,.35)',
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,.2)',
  },
  listItemActive: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    alignSelf: 'stretch',
    padding: 20,
    borderBottomWidth: 3,
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(5,5,5,.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class PromotionsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Promotions</Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity style={styles.leftButton} onPress={() => { navigation.goBack(); }}>
        <View style={styles.leftButtonContainer}>
          <Text style={styles.leftButtonText}>
            <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
          </Text>
        </View>
      </SalonTouchableOpacity>
    ),
  });


  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
    this.state = {
      activeData: promotions,
      storedData: null,
    };
  }

  componentDidMount() {
  }

  mapData(data) {
    return data.map((item) => {
      const mapped = {
        data: item,
        key: item.id,
      };

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
        { Field: 'promoCode', Values: [searchText.toLowerCase()] },
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
  _handleOnChangePromotion = (promotion) => {
    const { onChangePromotion, dismissOnSelect } = this.props.navigation.state.params;
    if (onChangePromotion) { onChangePromotion(promotion); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }
  _renderItem = ({ item: { data, key } }) => (
    <SalonTouchableHighlight
      style={data.id === this.state.activeListItem ? styles.listItemActive : styles.listItemInactive}
      onPress={() => {
        const { navigate, state } = this.props.navigation;
        if (state.params && state.params.onChangePromotion) {
          this._handleOnChangePromotion(data);
        } else {
          this.props.walkInActions.selectPromotion(data);
          navigate('WalkIn');
        }
      }}
      key={key}
      underlayColor="#ffffff"
      activeOpacity={2}
    >
      <View>
        <View style={{
          flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1, flexDirection: 'column' }}>
            { data.promoCode !== undefined && <Text style={styles.superTitle}>{data.promoCode}</Text>}
            <Text style={data.id === this.state.activeListItem ? [styles.listText, { fontFamily: 'OpenSans-Bold' }] : styles.listText}>{data.name}</Text>
          </View>
          <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.discountText}>{data.discount}%</Text>
          </View>
        </View>
      </View>
    </SalonTouchableHighlight>
  );


  renderList() {
    return (
      <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}>
        <View style={styles.sectionNavigate}>
          <Text style={[styles.listText, { fontFamily: 'OpenSans-Bold' }]}>No Promotion</Text>
        </View>
        <FlatList
          style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}
          data={this.state.activeData}
          renderItem={this._renderItem}
        />
      </View>
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
export default PromotionsScreen;
