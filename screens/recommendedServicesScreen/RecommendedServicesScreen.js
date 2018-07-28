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
import { getApiInstance } from '../../utilities/apiWrapper/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class RecommendedServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const serviceTitle = params.serviceTitle || '';
    const showCancelButton = params.showCancelButton || false;
    const handleSave = params.handleSave || (() => null);
    const onNavigateBack = params.onNavigateBack || (() => null);
    const handleGoBack = () => {
      onNavigateBack();
      navigation.goBack();
    };
    return ({
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
            Recommended Services
          </Text>
          <Text style={{
            fontFamily: 'Roboto',
            fontSize: 10,
            lineHeight: 12,
            color: 'white',
          }}
          >
            {serviceTitle}
          </Text>
        </View>
      ),
      headerLeft: showCancelButton ? (
        <SalonTouchableOpacity onPress={() => handleGoBack()}>
          <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
        </SalonTouchableOpacity>
      ) : null,
      headerRight: (
        <SalonTouchableOpacity onPress={() => handleSave()}>
          <Text style={{ fontSize: 14, fontFamily: 'Roboto-Medium', color: 'white' }}>Done</Text>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleSave: this.handleSave });
    const params = this.props.navigation.state.params || {};
    const serviceIds = params.services || [];

    this.state = {
      isLoading: false,
      selected: [],
      services: this.getServices(serviceIds),
    };
  }

  getServices = (ids) => {
    const { services } = this.props;
    const results = [];
    const check = (service, index) => service.id === ids[index].id;
    for (let i = 0; i < ids.length; i += 1) {
      const service = services.find(ser => check(ser, i));
      if (service) { results.push(service); }
    }
    return results;
  }

  handlePressRow = (index) => {
    const { services } = this.state;
    services[index].selected = !services[index].selected;
    this.setState({ services });
  }

  handleSave = () => {
    const { services } = this.state;
    const params = this.props.navigation.state.params || {};
    const onSave = params.onSave || false;
    if (onSave) {
      onSave(services.filter(item => item.selected));
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
      onPress={() => this.handlePressRow(index)}
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
