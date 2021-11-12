import * as React from 'react';
import { Text, View } from 'react-native';
import { get, includes } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';
import LoadingOverlay from '../../components/LoadingOverlay';
import styles from './styles';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';
import { NavigationScreenProp } from 'react-navigation';
import { Service } from '@/models';
import { ServicesReducer } from '@/redux/reducers/service';

interface AddonServicesScreenNavigationParams {
  selectedIds: number[];
}

interface AddonServicesScreenProps {
  navigation: NavigationScreenProp<any>;
  services: Service[];
  servicesState: ServicesReducer;
}

interface AddonServicesScreenState {
  selected: number[];
}

export default class AddonServicesScreen extends React.Component<AddonServicesScreenProps, AddonServicesScreenState> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const showCancelButton = params.showCancelButton || false;
    const handleSave = params.handleSave || (() => null);
    const serviceTitle = params.serviceTitle || '';
    const onNavigateBack = params.onNavigateBack || (() => null);
    const handleGoBack = () => {
      onNavigateBack();
      navigation.goBack();
    };
    return {
      tabBarVisible: false,
      header: (
        <SalonHeader
          title="Add-on Services"
          subTitle={serviceTitle}
          headerLeft={
            showCancelButton
              ? <SalonTouchableOpacity
                style={{ paddingLeft: 10 }}
                onPress={handleGoBack}
              >
                <Text style={styles.headerButtonText}>Cancel</Text>
              </SalonTouchableOpacity>
              : null
          }
          headerRight={
            <SalonTouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => handleSave()}
            >
              <Text style={[styles.headerButtonText, styles.robotoMedium]}>
                Done
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const selected = props.navigation.getParam('selectedIds', []);
    props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selected,
    };
  }

  onChangeSelected = selected => this.setState({ selected });

  handleSave = (empty = false) => {
    const { navigation: { goBack, state }, services: allServices } = this.props;
    const { selected } = this.state;
    const params = state.params || {};
    const onSave = get(params, 'onSave', srv => srv);
    if (empty) {
      onSave([]);
      return goBack();
    }
    const services = allServices.filter(srv => includes(selected, srv.id));
    onSave(services);
    return goBack();
  };

  handlePressNone = () => this.handleSave(true);

  renderSeparator = () => <View style={styles.listItemSeparator} />;

  render() {
    const { isLoading } = this.props.servicesState;
    const { selected } = this.state;
    const params = this.props.navigation.state.params || {};
    const services = get(params, 'services', []);
    return (
      <React.Fragment>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <SelectableServiceList
          selected={selected}
          services={services}
          onChangeSelected={this.onChangeSelected}
          noneButton={{ name: 'No Add-on', onPress: this.handlePressNone }}
        />
      </React.Fragment>
    );
  }
}
