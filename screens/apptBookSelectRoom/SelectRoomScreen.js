import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import apiWrapper from '../../utilities/apiWrapper';
import {
  InputGroup,
  InputLabel,
  InputDivider,
} from '../../components/formHelpers';

export default class SelectRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Assigned Room',
    headerLeft: (
      <SalonTouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{
            fontSize: 14,
            color: 'white',
          }}
        >
          Cancel
        </Text>
      </SalonTouchableOpacity>
    ),
  })
  state = {
    isLoading: false,
    rooms: [],
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      apiWrapper.doRequest('getRooms', {})
        .then(rooms => this.setState({ isLoading: false, rooms }))
        .catch(err => this.setState({ isLoading: false }));
    });
  }

  onPressItem = (item) => {
    const { navigation } = this.props;
    const params = navigation.state.params || {};
    const onSelect = params.onSelect || false;
    if (onSelect) {
      onSelect(item);
      navigation.goBack();
    }
  }

  renderItem = (text, value) => (
    <SalonTouchableOpacity
      style={{
        height: 44,
        paddingLeft: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
      }}
      onPress={() => this.onPressItem(value)}
    >
      <Text style={{
        textAlign: 'left',
        color: '#110A24',
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Roboto-Medium',
      }}
      >{text}
      </Text>
    </SalonTouchableOpacity>
  )

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F1F1F1',
      }}
      >
        <View style={{ marginVertical: 25 }}>
          {this.renderItem('None', null)}
        </View>
        {this.state.isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.rooms}
            ItemSeparatorComponent={() => (
              <View style={{ paddingLeft: 16 }}>
                <InputDivider />
              </View>
            )}
            renderItem={({ item, index }) => this.renderItem(item.name, item)}
          />
        </View>
      )}
      </View>
    );
  }
}
