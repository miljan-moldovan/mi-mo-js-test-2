import * as React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import { Store } from '../../utilities/apiWrapper';
import { InputDivider } from '../../components/formHelpers';
import SalonHeader from '../../components/SalonHeader';

export default class SelectRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <SalonHeader
        title="Assigned Room"
        headerLeft={
          <SalonTouchableOpacity
            style={{ paddingLeft: 10 }}
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
        }
      />
    ),
  })

  constructor(props) {
    super(props);
    this.state.supportedRoomIds = props.navigation.state.params.supportedRooms.map(room => room.id);
  }

  state = {
    isLoading: false,
    rooms: [],
    supportedRoomIds: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      Store.getRooms()
        .then(rooms => {
          const finalRoomsArray = [];
          this.state.supportedRoomIds.forEach(roomId => {
            const supportedRoom = rooms.find(room => room.id === roomId);
            for (let i = 1; i <= supportedRoom.roomCount; i++) {
              finalRoomsArray.push({
                name: `${supportedRoom.name}#${i}`,
                id: supportedRoom.id,
                roomOrdinal: i,
              });
            }
          });
          return this.setState({ isLoading: false, rooms: finalRoomsArray });
        })
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
