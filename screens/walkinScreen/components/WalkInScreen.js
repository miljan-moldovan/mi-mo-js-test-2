import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
  InputLabel,
  InputButton,
  InputGroup,
  InputDivider,
  SectionTitle,
} from '../../../components/formHelpers';
import ServiceSection from './serviceSection';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerButton: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
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

class WalkInScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params && navigation.state.params.walkin ? navigation.state.params.walkin : () => {};

    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Walk-in</Text>
          <Text style={styles.subTitleText}>25m Est. wait</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={() => { navigation.goBack(); }}>
          <View style={styles.leftButtonContainer}>
            <FontAwesome style={{ marginRight: 8, fontSize: 30, color: '#fff' }}>
              {Icons.angleLeft}
            </FontAwesome>
            <Text style={styles.leftButtonText}>
              Back
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity style={styles.rightButton} onPress={handlePress}>
          <View style={styles.rightButtonContainer}>
            <Text style={styles.rightButtonText}>
              Done
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
    });
  };

  // static navigationOptions = ({ navigation }) => {
  //   const handlePress = navigation.state.params && navigation.state.params.walkin ? navigation.state.params.walkin : () => {};
  //   // const { name, lastName } = navigation.state.params.item.client;
  //   return {
  //     // headerTitle: `${name} ${lastName}`,
  //     headerRight:
  // <HeaderRight
  //   disabled={false}
  //   button={(
  //     <Text style={styles.headerButton}>Done</Text>
  //     )}
  //   handlePress={handlePress}
  // />,
  //   };
  // };

  saving = false

  constructor(props) {
    super(props);
    this.state = {
      service: null,
      provider: null,
      client: null,
      isProviderRequested: false,
      isFirstAvailable: false,

    };
  }

  componentWillMount() {
    const { newAppointment } = this.props.navigation.state.params;
    if (newAppointment) {
      const { client, provider, service } = newAppointment;
      this.setState({ client, provider, service });
    }
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkin: () => {
        this.handleWalkin();
        // navigation.navigate('Main');
      },
    });
  }

  getFullName = () => {
    let fullName = '';
    const { client } = this.state;
    if (client) {
      if (client.name) {
        fullName = client.name;
      }
      if (client.lastName) {
        fullName = fullName ? `${fullName} ${client.lastName}` : client.lastName;
      }
    }
    return fullName;
  }

  handleWalkin = () => {
    if (!this.saving) {
      this.saving = true;
      const {
        service,
        provider,
        client,
        isProviderRequested,
        isFirstAvailable,
      } = this.state;
      const params = {
        clientId: client.id,
        email: client.email,
        phone: client.phone,
        isFirstAvailable: provider.isFirstAvailable,
        providerId: provider.id,
        isProviderRequested,
        serviceId: service.id,
      };
      this.props.walkInActions.postWalkinClient(params).then(() => {
        console.log('params: ', params);
        this.saving = false;
        this.props.navigation.navigate('Main');
      });
    }
  }

  handleUpdateService= (service) => {
    this.setState({ service });
  }

  handleUpdateProvider= (provider) => {
    this.setState({ provider });
  }

  handleUpdateIsProviderRequested= () => {
    this.setState({ isProviderRequested: !this.state.isProviderRequested });
  }


  handleUpdateClient= (client) => {
    this.setState({ client });
  }

  handlePressClient = () => {
    this.props.navigation.navigate('Clients', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: this.handleClientSelection,
    });
  }

  render() {
    const fullName = this.getFullName();
    const email = this.state.client && this.state.client.email ? this.client.email : '';
    const phones = this.state.client && this.state.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');
    return (
      <ScrollView style={styles.container}>
        <SectionTitle value="CLIENT" />
        <InputGroup>
          <InputButton label="Client" value={fullName} onPress={this.handlePressClient} />
          <InputDivider />
          <InputLabel label="Email" value={email} />
          <InputDivider />
          <InputLabel label="Phone" value={phones} />
        </InputGroup>
        <SectionTitle value="SERVICE AND PROVIDER" />
        <ServiceSection
          service={this.state.service}
          provider={this.state.provider}
          navigate={this.props.navigation.navigate}
          onRemove={this.handleRemoveService}
          onUpdateService={this.handleUpdateService}
          onUpdateProvider={this.handleUpdateProvider}
          onUpdateIsProviderRequested={this.handleUpdateIsProviderRequested}
          isProviderRequested={this.state.isProviderRequested}
        />
      </ScrollView>
    );
  }
}

export default WalkInScreen;
