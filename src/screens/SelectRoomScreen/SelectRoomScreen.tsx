import * as React from 'react';
import {
  Text,
} from 'react-native';
import { times, flatten, chain, includes } from 'lodash';
import SalonFlatList from '@/components/common/SalonFlatList';
import { Store } from '@/utilities/apiWrapper';
import { Room, StoreRoom, ServiceItem, Maybe } from '@/models';
import { NavigationScreenProp } from 'react-navigation';
import SalonListItem from '@/components/common/SalonListItem';
import SalonHeader from '@/components/SalonHeader';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import styles from './styles';
import { NewAppointmentReducer } from '@/redux/reducers/newAppointment';
import { NewApptActions } from '@/redux/actions/newAppointment';
import { shouldSelectRoom } from '../newAppointmentScreen/helpers';
import SalonIcon from '@/components/SalonIcon';
import Colors from '@/constants/Colors';
import { getServiceName } from './helpers';

interface SelectRoomScreenNavigationParams {
  serviceItem?: ServiceItem;
  onChange?: ({
    room: StoreRoom,
    roomOrdinal: number,
  }) => void;
}

interface SelectRoomScreenProps {
  navigation: NavigationScreenProp<SelectRoomScreenNavigationParams>;
  newApptState: NewAppointmentReducer;
  updateServiceItems: (serviceItems: ServiceItem[]) => any;
}

interface SelectRoomScreenState {
  isLoading: boolean;
  rooms: StoreRoom[];
  services: RoomServiceItem[];
  currentOpenService: string;
}

export interface RoomServiceItem {
  availableRooms: number[];
  serviceItem: ServiceItem;
}

const convertServiceItem = (itm: ServiceItem) => {
  const availableRooms = itm.service.service.supportedRooms.map(room => room.id);
  return {
    availableRooms,
    serviceItem: itm,
    selectedRoom: null,
    selectedRoomOrdinal: null,
  };
};

class SelectRoomScreen extends React.Component<SelectRoomScreenProps, SelectRoomScreenState> {
  static navigationOptions = ({ navigation }) => {
    const defaultLeftButton = (
      <SalonTouchableOpacity
        style={styles.leftButton}
        onPress={navigation.goBack}
      >
        <Text style={styles.leftButtonText}>Cancel</Text>
      </SalonTouchableOpacity>
    );
    const serviceName = navigation.getParam('serviceName', null);
    const leftButton = navigation.getParam('leftButton', defaultLeftButton);
    const rightButton = navigation.getParam('rightButton', null);
    return {
      header: (
        <SalonHeader
          title="Select Room"
          subTitle={serviceName}
          headerLeft={leftButton}
          headerRight={rightButton}
        />
      ),
    };
  }

  leftButton = (
    <SalonTouchableOpacity
      style={styles.leftButton}
      onPress={this.previousService}
    >
      <SalonIcon
        name="angleLeft"
        size={14}
        color={Colors.white}
      />
    </SalonTouchableOpacity>
  );

  constructor(props: SelectRoomScreenProps) {
    super(props);
    const {
      newApptState: { serviceItems },
    } = props;
    let services: RoomServiceItem[] = [];
    let serviceName = '';
    let currentService = null;
    if (this.params.serviceItem) {
      serviceName = getServiceName(this.params.serviceItem);
    } else {
      services = chain(serviceItems)
        .filter(itm => shouldSelectRoom(itm))
        .map(convertServiceItem)
        .value();
      [currentService] = services;
      serviceName = currentService ? getServiceName(currentService.serviceItem) : null;
    }
    props.navigation.setParams({ serviceName });
    this.state = {
      services,
      rooms: [],
      isLoading: false,
      currentOpenService: currentService ? currentService.serviceItem.itemId : '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      Store.getRooms()
        .then(rooms => this.setState({ rooms, isLoading: false }));
    });
  }

  get data() {
    const { rooms, currentOpenService, services } = this.state;
    const currentService = this.params.serviceItem
      ? convertServiceItem(this.params.serviceItem)
      : services.find(itm => itm.serviceItem.itemId === currentOpenService);
    const availableRooms = currentService
      ? rooms.filter(room => includes(currentService.availableRooms, room.id))
      : rooms;
    const roomOptions = flatten(
      availableRooms.map(room => {
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

  get params() {
    const { getParam } = this.props.navigation;
    return {
      serviceItem: getParam('serviceItem'),
      onChange: getParam('onChange'),
    } as SelectRoomScreenNavigationParams;
  }

  previousService = () => {
    const { services, currentOpenService } = this.state;
    const currentIndex = services.findIndex(itm => itm.serviceItem.itemId === currentOpenService);
    const prevService = currentIndex ? services[currentIndex - 1] : null;
    if (prevService) {
      const serviceName = getServiceName(prevService.serviceItem);
      this.props.navigation.setParams({
        leftButton: this.leftButton,
        serviceName,
      });
      this.setState({ currentOpenService: prevService.serviceItem.itemId });
    } else {
      this.props.navigation.setParams({ leftButton: undefined });
    }
  }

  onPressItem = (item: { room: StoreRoom, roomOrdinal: number, name: string }) => {
    const { currentOpenService } = this.state;
    if (this.params.onChange) {
      this.params.onChange({
        room: item.room,
        roomOrdinal: item.roomOrdinal,
      });
      return this.props.navigation.goBack();
    }
    const services = [...this.state.services];
    const currentIndex = services.findIndex(itm => itm.serviceItem.itemId === currentOpenService);
    const nextService = services[currentIndex + 1];
    services[currentIndex].serviceItem.hasSelectedRoom = true;
    services[currentIndex].serviceItem.service.room = item.room;
    services[currentIndex].serviceItem.service.roomOrdinal = item.roomOrdinal;
    this.setState({
      services,
      currentOpenService: nextService ? nextService.serviceItem.itemId : null,
    }, () => {
      if (nextService) {
        const serviceName = getServiceName(nextService.serviceItem);
        this.props.navigation.setParams({
          serviceName,
          leftButton: this.leftButton,
        });
      } else {
        this.props.updateServiceItems(services.map(itm => itm.serviceItem));
        this.props.navigation.goBack();
      }
    });
  }

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
