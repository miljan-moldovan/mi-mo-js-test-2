// @flow
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as formCacheActions from '../actions/formCache';
import fetchFormCache from '../utilities/fetchFormCache';
import SalonTouchableOpacity from '../components/SalonTouchableOpacity';

const Item = ({ onPress, children }) => (
  <SalonTouchableOpacity style={styles.itemContainer} onPress={onPress}>
    {children}
  </SalonTouchableOpacity>
);
const NavButton = ({ children, onPress }) => (
  <SalonTouchableOpacity style={styles.navButton} onPress={onPress}>
    <Text style={styles.navButtonText}>{children}</Text>
  </SalonTouchableOpacity>
);
const ItemText = ({ children }) => (
  <Text style={styles.itemText}>
    {children}
  </Text>
);
const ItemLabel = ({ children }) => (
  <Text style={styles.itemTopLabel}>
    {children}
  </Text>
);
const SectionExpand = ({ children }) => (
  <View style={styles.expandContainer}>
    <Text style={styles.expandText}>EXPAND</Text>
  </View>
);

const appointment = {
  client: {
    id: 8423,
    name: 'Aaran Willifoard',
    notes: null,
  },
  date: '2017-12-27T00:00:00.000Z',
  requested: true,
  start_time: '10:45 AM',
  services: [{
    description: 'Buzz Cut MVP',
    id: 34,
    length: '60 min',
    price: '40.00',
    start_time: '11:00 AM',
    end_time: '12:45 PM',
    employees: [{
  			id: 105,
  			lastName: 'Otero',
  			middleName: null,
  			name: 'Debora',
  		}],
  }],
};


class NewAppointmentsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header:
  <View style={{ backgroundColor: 'red', height: 150 }}>
    <Image
      source={require('../assets/images/appointments/background_top.png')}
      style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              position: 'absolute',
              top: 0,
              right: 0,
            }}
    />
    <View style={{
 marginTop: 60, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
}}
    >
      <NavButton onPress={() => navigation.goBack()}>Cancel</NavButton>
      <Text style={styles.navTitle}>Modify Appointment</Text>
      <NavButton>.</NavButton>
    </View>
    <View style={{
 backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, marginVertical: 10, marginTop: 'auto', marginHorizontal: 20,
}}
    >
      <Text style={styles.headerDateLabel}>DATE</Text>
      <Text style={styles.headerDateValue}>Tuesday, February 17, 2017</Text>
    </View>
  </View>,
  });
  state = {
    item: { ...appointment },
  }
  componentWillMount() {
    // the formCache data can be accessed directly in redux state or
    // preferably through the utility function fetchFormCache
    const cachedForm = fetchFormCache('NewAppointmentsScreen', '0', this.props.formCache);
    if (cachedForm) {
      // something was stored for this screen. use that instead of the default state
      this.setState({ item: cachedForm });
    } else {
      // go the usual route e.g.: use default screen state, fetch data from the network etc.
    }
  }
  _handleSavePress = () => {
    // 1 - send information to API - if successful, call purgeForm(formName, itemIdentifier)
    // 2 - receive network error
    // 3 - save info with storeForm
    // this plain object holds all fields we want to persist/restore in the form
    // anything can be put in it
    const formData = this.state.item;
    // this is the name of the screen or form we want to persist info from
    const formName = 'NewAppointmentsScreen';
    // this is the identifier of the item we are editing (in list views, for ex.)
    // in this case, we are loading this info next time the user tries to create
    // a new appointment, so we will just use '0'
    const itemIdentifier = '0';
    this.props.storeForm(formName, itemIdentifier, formData);
    // 4 - inform user of the error and that the info is saved
    Alert.alert('Network Error', 'Due to a network error, your action could not be completed. \nYou data has been saved locally and you can return to this screen at any time to resume your work.');
  }

  _handleClientPress = () => {
    this.props.navigation.navigate('ChangeClient', {
      dismissOnSelect: true,
      onChangeClient: this._handleClientChange,
    });
  }
  _handleClientChange = (client) => {
    this.setState({
      item: {
        ...this.state.item,
        client: { ...client },
      },
    });
  }
  _handleServicePress = () => {
    this.props.navigation.navigate('Services', {
      dismissOnSelect: true,
      onChangeService: this._handleServiceChange,
    });
  }
  _handleServiceChange = (service) => {
    const { item } = this.state;
    this.setState({
      item: {
        ...item,
        services: [{
          ...item.services[0],
          id: service.id,
          description: service.name,
        },
        ],
      },
    });
  }
  _handleProviderPress = () => {
    this.props.navigation.navigate('Providers', {
      dismissOnSelect: true,
      onChangeProvider: this._handleProviderChange,
    });
  }
  _handleProviderChange = (provider) => {
    const { item } = this.state;
    this.setState({
      item: {
        ...item,
        services: [
          {
            ...item.services[0],
            employees: [
              provider,
            ],
          },
        ],
      },
    });
  }
  render() {
    const { item } = this.state;
    const service = item.services[0];
    const employee = `${service.employees[0].name} ${service.employees[0].lastName}`;
    const client = item.client.name;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainer={styles.container} style={{ flex: 1 }}>
          <Item>
            <View>
              <ItemLabel>
                START TIME
              </ItemLabel>
              <ItemText>
                {item.start_time}
              </ItemText>
            </View>
          </Item>
          <Item onPress={this._handleClientPress}>
            <View>
              <ItemLabel>
                CLIENT
              </ItemLabel>
              <ItemText>
                {client}
              </ItemText>
            </View>
          </Item>
          <Item>
            <ItemText>
                Requested
            </ItemText>
            <Switch value={item.requested} />
          </Item>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>SERVICE INFO</Text>
          </View>
          <Item onPress={this._handleServicePress}>
            <View>
              <ItemLabel>
                ADULT
              </ItemLabel>
              <ItemText>
                {service.description}
              </ItemText>
            </View>
          </Item>
          <Item onPress={this._handleProviderPress}>
            <View>
              <ItemLabel>
                PROVIDER
              </ItemLabel>
              <ItemText>
                {employee}
              </ItemText>
            </View>
          </Item>
          <Item>
            <View style={{ flex: 1, paddingRight: 20 }}>
              <ItemLabel>
                STARTS
              </ItemLabel>
              <ItemText>
                {service.start_time}
              </ItemText>
            </View>
            <Image source={require('../assets/images/appointments/bigchevron.png')} style={styles.bigChevron} />
            <View style={{ flex: 1, paddingLeft: 20 }}>
              <ItemLabel>
                ENDS
              </ItemLabel>
              <ItemText>
                {service.end_time}
              </ItemText>
            </View>
          </Item>
          <Item>
            <View>
              <ItemLabel>
                LENGTH
              </ItemLabel>
              <ItemText>
                {service.length}
              </ItemText>
            </View>
          </Item>
          <Item>
            <View>
              <ItemLabel>
                PRICE
              </ItemLabel>
              <ItemText>
                $ {service.price}
              </ItemText>
            </View>
          </Item>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>TIME INTERVALS</Text>
            <SectionExpand />
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>ROOM & RESOURCE</Text>
            <SectionExpand />
          </View>
          <View style={{ height: 80, backgroundColor: 'white' }} />
        </ScrollView>
        <SalonTouchableOpacity style={styles.mainButtonContainer} onPress={this._handleSavePress}>
          <Text style={styles.mainButtonTitle}>SAVE</Text>
          <Text style={styles.mainButtonSubtitle}>Total ${service.price} | {service.length}</Text>
        </SalonTouchableOpacity>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  formCache: state.formCache,
});
export default connect(mapStateToProps, formCacheActions)(NewAppointmentsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  itemContainer: {
    height: 80,
    width: '100%',
    borderColor: '#e8e8e8',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  itemText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
  itemTopLabel: {
    color: '#ccc',
    fontSize: 11,
    fontFamily: 'OpenSans-Regular',
  },
  bigChevron: {
    height: 79,
    resizeMode: 'contain',
  },
  sectionHeader: {
    paddingBottom: 8,
    height: 55,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    marginLeft: 20,
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
  },
  expandText: {
    color: '#67A3C7',
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    marginHorizontal: 20,
  },
  mainButtonContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#67A3C7',
  },
  mainButtonTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
  },
  mainButtonSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255,255,255,0.6)',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
  },
  navTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
  headerDateLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans-SemiBold',
    color: 'rgba(255,255,255,0.4)',
  },
  headerDateValue: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
});
