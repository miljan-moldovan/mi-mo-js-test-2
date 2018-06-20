import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import apiWrapper from '../../utilities/apiWrapper';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class RequiredServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 17,
          lineHeight: 22,
          color: 'white',
        }}
        >
          Required Services
        </Text>
        <Text style={{
          fontFamily: 'Roboto',
          fontSize: 10,
          lineHeight: 12,
          color: 'white',
        }}
        >
          {navigation.state.params.serviceTitle}
        </Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
    headerRight: null,
  });

  constructor(props) {
    super(props);

    const params = this.props.navigation.state.params || {};
    const serviceIds = params.services || [];

    this.state = {
      serviceIds,
      isLoading: false,
      selected: [],
      services: [],
    };
  }

  componentWillMount() {
    const { serviceIds } = this.state;
    if (serviceIds.length) {
      this.setState({ isLoading: true }, () => {
        const servicePromises = serviceIds.map(item => this.getService(item.id));
        return Promise.all(servicePromises)
          .then(services => this.setState({
            isLoading: false,
            services: services.map(item => ({
              id: item.id,
              name: item.description,
              maxDuration: item.duration,
              minDuration: item.duration,
              price: item.price,
            })),
          }))
          .catch(() => this.setState({ isLoading: false }));
      });
    }
  }

  getService = id => apiWrapper.doRequest('getService', { path: { id } })

  handlePressRow = (item) => {
    const params = this.props.navigation.state.params || {};
    const onSave = params.onSave || false;
    if (onSave) {
      onSave(item);
      this.props.navigation.goBack();
    }
  }

  renderItem = ({ item, index }) => (
    <SalonTouchableOpacity
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 44,
        paddingHorizontal: 16,
        alignItems: 'center',
      }}
      onPress={() => this.handlePressRow(item)}
    >
      <View style={{
          flex: 9 / 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{
            fontSize: 14,
            color: '#2F3142',
          }}
        >{item.name}
        </Text>
        {!!item.price && (
          <Text style={{ fontSize: 12, color: '#115ECD' }}>{`$${item.price.toFixed(2)}`}</Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 / 10 }}>
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          {item.selected && (
            <Icon
              name="checkCircle"
              color="#1DBF12"
              size={14}
              type="solid"
            />
          )}
        </View>
      </View>
    </SalonTouchableOpacity>
  )

  renderSeparator = () => (
    <View style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#C0C1C6',
      }}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            style={{ marginTop: 14 }}
            data={this.state.services}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
          />
        )}
      </View>
    );
  }
}
