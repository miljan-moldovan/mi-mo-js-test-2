import * as React from 'react';
import { Text } from 'react-native';
import { chain, get } from 'lodash';
import SalonFlatList from '@/components/common/SalonFlatList';
import { Store } from '@/utilities/apiWrapper';
import { ServiceItem, StoreResource } from '@/models';
import { NavigationScreenProp } from 'react-navigation';
import SalonListItem from '@/components/common/SalonListItem';
import SalonHeader from '@/components/SalonHeader';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import styles from './styles';
import { NewAppointmentReducer } from '@/redux/reducers/newAppointment';
import { shouldSelectResource } from '../newAppointmentScreen/helpers';
import SalonIcon from '@/components/SalonIcon';
import Colors from '@/constants/Colors';
import { getServiceName } from './helpers';

interface SelectResourceScreenNavigationParams {
  serviceItem?: ServiceItem;
  onChange?: ({
    resource: StoreResource,
    resourceOrdinal: number,
  }) => void;
}

interface SelectResourceScreenProps {
  navigation: NavigationScreenProp<SelectResourceScreenNavigationParams>;
  newApptState: NewAppointmentReducer;
  updateServiceItems: (serviceItems: ServiceItem[]) => any;
}

interface SelectResourceScreenState {
  isLoading: boolean;
  services: ResourceServiceItem[];
  allResources: StoreResource[];
  currentOpenService: string;
}

export interface ResourceServiceItem {
  supportedResource: StoreResource;
  serviceItem: ServiceItem;
}

const convertServiceItem = (itm: ServiceItem) => ({
  supportedResource: itm.service.service.supportedResource,
  serviceItem: itm,
  selectedResource: null,
  selectedResourceOrdinal: null,
});

class SelectResourceScreen extends React.Component<SelectResourceScreenProps, SelectResourceScreenState> {
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
          title="Select Resource"
          subTitle={serviceName}
          headerLeft={leftButton}
          headerRight={rightButton}
        />
      ),
    };
  };

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

  goBack = () => {
    const { onNavigateBack } = this.props.navigation.state.params;
    onNavigateBack && onNavigateBack();
    this.props.navigation.goBack();
  };

  constructor(props: SelectResourceScreenProps) {
    super(props);
    const {
      newApptState: { serviceItems },
    } = props;
    let services: ResourceServiceItem[] = [];
    let serviceName = '';
    let currentService = null;
    if (this.params.serviceItem) {
      serviceName = getServiceName(this.params.serviceItem);
    } else {
      services = chain(serviceItems)
        .filter(itm => shouldSelectResource(itm))
        .map(convertServiceItem)
        .value();
      [currentService] = services;
      serviceName = currentService ? getServiceName(currentService.serviceItem) : null;
    }
    props.navigation.setParams({ serviceName });
    this.state = {
      services,
      isLoading: false,
      allResources: [],
      currentOpenService: currentService ? currentService.serviceItem.itemId : '',
    };
  }

  componentDidMount(): void {
    this.setState({ isLoading: true }, () => {
      Store.getResources()
        .then(resources => this.setState({ allResources: resources, isLoading: false }));
    });
  }

  get data() {
    const { allResources, currentOpenService, services } = this.state;
    const currentService = this.params.serviceItem
      ? convertServiceItem(this.params.serviceItem)
      : services.find(itm => itm.serviceItem.itemId === currentOpenService);
    if (!currentService) { return; }
    const resourcesArray = [];
    const supportedResourceId = get(currentService, 'supportedResource.id', null);
    const supportedResource = allResources.find(res => get(res, 'id') === supportedResourceId);
    if (!supportedResource) { return []; }
    for (let i = 1; i < supportedResource.resourceCount + 1; i += 1) {
      resourcesArray.push({
        resource: supportedResource,
        id: get(supportedResource, 'id'),
        name: `${supportedResource.name} #${i}`,
        resourceOrdinal: i,
      });
    }
    return this.params.serviceItem ?
      [{ name: 'None', id: null, resourceOrdinal: null }, ...resourcesArray]
      : resourcesArray;
  }

  get params() {
    const { getParam } = this.props.navigation;
    return {
      serviceItem: getParam('serviceItem'),
      onChange: getParam('onChange'),
    } as SelectResourceScreenNavigationParams;
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
  };

  onPressItem = (item: { resource: StoreResource, resourceOrdinal: number, name: string }) => {
    const { currentOpenService } = this.state;
    if (this.params.onChange) {
      this.params.onChange({
        resource: item.resource,
        resourceOrdinal: item.resourceOrdinal,
      });
      return this.goBack();
    }
    const services = [...this.state.services];
    const currentIndex = services.findIndex(itm => itm.serviceItem.itemId === currentOpenService);
    const nextService = services[currentIndex + 1];
    services[currentIndex].serviceItem.hasSelectedResource = true;
    services[currentIndex].serviceItem.service.resource = item.resource;
    services[currentIndex].serviceItem.service.resourceOrdinal = item.resourceOrdinal;

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
        this.goBack();
      }
    });
  };

  renderItem = ({ item }) => {
    const onPress = () => this.onPressItem(item);
    return (
      <SalonListItem
        text={item.name}
        onPress={onPress}
      />
    );
  };

  render() {
    return (
      <SalonFlatList
        data={this.data}
        renderItem={this.renderItem}
      />
    );
  }
}

export default SelectResourceScreen;
