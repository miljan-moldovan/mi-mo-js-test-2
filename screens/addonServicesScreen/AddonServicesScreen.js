import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class AddonServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add-on Services',
    subtitle: 'Quick Style',
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
    rightButton: <Text style={{ fontSize: 14, color: 'white' }}>Done</Text>,
    rightButtonOnPress: () => navigation.state.params.onSave(),
  });

  state = {
    selected: [],
    services: [
      {
        description: 'No Add-on',
        price: 0,
        selected: false,
      },
      {
        description: 'Add-on Keratin Treatment',
        price: 0,
        selected: false,
      },
      {
        description: 'Add-on Bang Trim',
        price: 30,
        selected: true,
      },
      {
        description: 'Add-on Repair Treatment',
        price: 30,
        selected: false,
      },
      {
        description: 'Add-on Bang Trim  ',
        price: 0,
        selected: false,
      },
      {
        description: 'Add-on Repair',
        price: 0,
        selected: false,
      },
    ],
  };

  handlePressRow = (index) => {
    const { services } = this.state;
    services[index].selected = !services[index].selected;
    this.setState({ services });
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
        >{item.description}
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
        <FlatList
          style={{ marginTop: 14 }}
          data={this.state.services}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
