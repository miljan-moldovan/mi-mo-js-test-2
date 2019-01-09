import * as React from 'react';
import {
  Text,
} from 'react-native';
import { times, flatten } from 'lodash';
import SalonFlatList from '@/components/common/SalonFlatList';
import { Store } from '@/utilities/apiWrapper';
import { Room, StoreRoom } from '@/models';
import { NavigationScreenProp } from 'react-navigation';
import SalonListItem from '@/components/common/SalonListItem';
import SalonHeader from '@/components/SalonHeader';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import styles from './styles';

interface SelectRoomScreenNavigationParams {
  supportedRooms: number[];
  onChange: (room: Room) => void;
}

interface SelectRoomScreenProps {
  navigation: NavigationScreenProp<SelectRoomScreenNavigationParams>;
}

interface SelectRoomScreenState {
  isLoading: boolean;
  rooms: StoreRoom[];
}

class SelectRoomScreen extends React.Component<SelectRoomScreenProps, SelectRoomScreenState> {
  static navigationOptions = ({ navigation }) => {
    const serviceName = navigation.getParam('serviceName');
    return {
      header: (
        <SalonHeader
          title="Select Room"
          subTitle={serviceName}
          headerLeft={
            <SalonTouchableOpacity
              style={styles.leftButton}
              onPress={navigation.goBack}
            >
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  }

  state = {
    isLoading: false,
    rooms: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      Store.getRooms()
        .then(rooms => this.setState({ rooms, isLoading: false }));
    });
  }

  get data() {
    const { rooms } = this.state;
    const roomOptions = flatten(
      rooms.map(room => {
        return times(room.roomCount, i => {
          const roomNumber = i + 1;
          return {
            room,
            name: `${room.name} #${roomNumber}`,
            roomOrdinal: roomNumber,
          };
        });
      }),
    );
    return roomOptions;
  }

  onPressItem = (item) => {
    const { getParam, goBack } = this.props.navigation;
    const onChange = getParam('onChange');
    onChange(item);
    goBack();
  };

  renderItem = ({ item }) => {
    const onPress = () => this.onPressItem(item);
    return (
      <SalonListItem
        text={item.name}
        onPress={onPress}
      />
    );
  }

  render() {
    return (
      <SalonFlatList
        data={this.data}
        renderItem={this.renderItem}
      />
    );
  }
}
export default SelectRoomScreen;
