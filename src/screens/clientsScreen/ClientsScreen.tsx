import * as React from 'react';
import { View, Text } from 'react-native';
import { get, isFunction } from 'lodash';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import ClientList from './components/clientList';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import Icon from '@/components/common/Icon';
import styles from './styles';
import BarsActionSheet from '../../components/BarsActionSheet';
import { Client } from '@/models';
import { SalonSearchHeaderActions, SalonSearchHeaderReducer } from '@/redux/reducers/searchHeader';

const query = {
  fromAllStores: false,
  'nameFilter.FilterRule': 3,
  'nameFilter.SortOrder': 1,
};

export interface NavigationParams {
  isModal?: boolean;
  headerProps?: Object;
  stateProps?: Object;
  defaultProps?: Object;
  hideAddButton?: boolean;
  dismissOnSelect?: boolean;
  isWalkin?: boolean;
  ignoreNav?: boolean;
  clearSearch?: () => void;
  onPressMenu?: () => void;
  onChangeClient?: (client: Client) => void;
  onChangeWithNavigation?: (client: Client, navigation: NavigationScreenProp<any>) => void;
}

export interface Props {
  isLoadingMore: boolean;
  total: number;
  showing: number;
  clientsActions: any;
  clientsState: any;
  auth: any;
  clientsSectionDataSource: any;
  salonSearchHeaderActions: SalonSearchHeaderActions;
  salonSearchHeaderState: SalonSearchHeaderReducer;
  navigation: NavigationScreenProp<any, NavigationParams>;
  storeActions: {
    reselectMainStore: Function;
  };
}

export interface State {

}

class ClientsScreen extends React.Component<Props, State> {
  BarsActionSheet?: BarsActionSheet;
  static navigationOptions = ({ navigation }) => {
    const onPressMenu = navigation.getParam('onPressMenu', () => { });
    const isModal = navigation.getParam('isModal', false);
    const headerProps = navigation.getParam('headerProps', {});
    const stateProps = navigation.getParam('defaultProps', {});
    const hideAddButton = navigation.getParam('hideAddButton', false);
    const defaultProps = {
      title: 'Clients',
      subTitle: null,
      leftButtonOnPress: () => {
        navigation.goBack();
      },
      leftButton: navigation.state.routeName === 'ClientsMain'
        ? <Text style={styles.leftButtonText}>Cancel</Text>
        : null,
      rightButton: hideAddButton
        ? null
        : <Text style={styles.rightButtonText}>Add Client</Text>,
      rightButtonOnPress: () => {
        navigation.navigate(isModal ? 'ModalNewClient' : 'NewClient', {
          onChangeClient: navigation.state.params.onChangeClient,
        });
      },
    };
    const mergedProps = {
      ...defaultProps,
      ...stateProps,
      ...headerProps,
    };
    const { rightButton, rightButtonOnPress, title, subTitle } = mergedProps;

    let { leftButton, leftButtonOnPress } = mergedProps;

    const clearSearch = navigation.state.params &&
      navigation.state.params.clearSearch
      ? navigation.state.params.clearSearch
      : null;
    const { routeName } = navigation.state;
    const isMainClients =
      routeName === 'ClientsMain' || routeName === 'ClientsStack';
    if (isMainClients) {
      leftButton = <Icon name="bars" type="solid" color="white" size={17} />;
      leftButtonOnPress = onPressMenu;
    }
    return {
      header: () => (
        <SalonSearchHeader
          focusOnMount
          clearSearch={clearSearch}
          title={title}
          subTitle={subTitle}
          leftButton={leftButton}
          leftButtonOnPress={() => {
            leftButtonOnPress(navigation);
          }}
          rightButton={
            navigation.state.params && navigation.state.params.hideAddButton
              ? null
              : rightButton
          }
          rightButtonOnPress={() => {
            rightButtonOnPress(navigation);
          }}
          hasFilter
          containerStyle={styles.headerContainer}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.clearSearch();
    this.props.navigation.setParams({
      onPressMenu: this.handleLeftButton,
      defaultProps: this.state.headerProps,
      clearSearch: this.clearSearch,
      ignoreNav: false,
    });
  }

  componentWillUnmount() {
    this.props.clientsActions.setClients([]);
  }

  state = {
    headerProps: {
      title: 'Clients',
      subTitle: null,
      defaultLeftButtonOnPress: () => {
        this.handleLeftButton();
      },
      rightButtonOnPress: () => {
        this.props.navigation.navigate(
          this.props.navigation.state.params.isModal
            ? 'ModalNewClient'
            : 'NewClient',
          { onChangeClient: this.onChangeClient }
        );
      },
    },
  };

  componentDidUpdate(prevProps) {
    const { salonSearchHeaderState } = prevProps;
    if (
      this.props.salonSearchHeaderState.selectedFilter !==
      salonSearchHeaderState.selectedFilter
    ) {
      if (
        salonSearchHeaderState.searchText &&
        salonSearchHeaderState.searchText.length > 0
      ) {
        const params = {
          ...query,
          'nameFilter.FilterValue': salonSearchHeaderState.searchText,
          fromAllStores: !!salonSearchHeaderState.selectedFilter,
        };
        this.props.clientsActions.getClients(params);
      }
    }
  }

  get params() {
    const { navigation: { getParam } } = this.props;
    const onPressMenu = getParam('onPressMenu', () => { });
    const isModal = getParam('isModal', false);
    const headerProps = getParam('headerProps', {});
    const stateProps = getParam('defaultProps', {});
    const hideAddButton = getParam('hideAddButton', false);
    const dismissOnSelect = getParam('dismissOnSelect', false);
    const ignoreNav = getParam('ignoreNav', false);
    const isWalkin = getParam('isWalkin', false);
    const onChangeClient = getParam('onChangeClient', null);
    const onChangeWithNavigation = getParam('onChangeWithNavigation');
    const clearSearch = getParam('clearSearch');
    return {
      onPressMenu,
      isModal,
      headerProps,
      stateProps,
      hideAddButton,
      dismissOnSelect,
      onChangeClient,
      onChangeWithNavigation,
      ignoreNav,
      isWalkin,
      clearSearch,
    } as NavigationParams;
  }

  handleLeftButton = () => {
    if (this.BarsActionSheet) {
      this.BarsActionSheet.show();
    }
  };

  clearSearch = () => {
    this.props.clientsActions.setClients([]);
  };

  onChangeClient = client => {
    const {
      navigation,
      salonSearchHeaderActions: { setShowFilter },
    } = this.props;
    const {
      onChangeClient,
      onChangeWithNavigation,
      dismissOnSelect,
    } = this.params;
    if (isFunction(onChangeWithNavigation)) {
      onChangeWithNavigation(client, navigation);
      setShowFilter(false);
    } else if (isFunction(onChangeClient)) {
      onChangeClient(client);
      if (dismissOnSelect) {
        setShowFilter(false);
        navigation.goBack();
      }
    }
  };

  filterClients = searchText => {
    if (searchText && searchText.length > 0) {
      const params = {
        ...query,
        'nameFilter.FilterValue': searchText.trim(),
        fromAllStores: !!this.props.salonSearchHeaderState.selectedFilter,
      };
      this.props.clientsActions.getClients(params);
    }
  };

  filterSuggestions = searchText => {
    if (searchText && searchText.length > 0) {
      const filtered = [];
      for (
        let i = 0;
        i < this.props.clientsState.suggestionsList.length;
        i += 1
      ) {
        const item = this.props.clientsState.suggestionsList[i];

        if (item.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          filtered.push(item);
        }
      }

      this.props.clientsActions.setFilteredSuggestions(filtered);
    } else {
      this.props.clientsActions.setFilteredSuggestions(
        this.props.clientsState.suggestionsList
      );
    }
  };

  filterList = searchText => {
    if (!this.props.salonSearchHeaderState.showFilter) {
      this.filterClients(searchText);
    } else {
      this.filterSuggestions(searchText);
    }
  };

  fetchMore = () => {
    const { total, showing, salonSearchHeaderState: { searchText } } = this.props;
    if (total > showing && searchText && searchText.length > 0) {
      const params = {
        ...query,
        'nameFilter.FilterValue': searchText,
        'nameFilter.Skip': showing,
        fromAllStores: !!this.props.salonSearchHeaderState.selectedFilter,
      };
      this.props.clientsActions.getMoreClients(params);
    }
  };

  render() {
    const { onChangeClient, onChangeWithNavigation } = this.params;
    const onChange = !onChangeClient && !onChangeWithNavigation ? null : this.onChangeClient;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            this.props.salonSearchHeaderActions.setShowFilter(true);
            this.props.salonSearchHeaderActions.setFilterAction(
              this.filterClients
            );
          }}
        />
        <BarsActionSheet
          ref={item => (this.BarsActionSheet = item)}
          onLogout={this.props.auth.logout}
          navigation={this.props.navigation}
          onChangeStore={this.props.storeActions.reselectMainStore}
        />
        <View style={styles.clientsList}>
          <ClientList
            isWalkin={this.params.isWalkin}
            isLoadingMore={this.props.isLoadingMore}
            fetchMore={this.fetchMore}
            navigate={this.props.navigation.navigate}
            boldWords={this.props.salonSearchHeaderState.searchText.trim()}
            style={styles.clientListContainer}
            clients={this.props.clientsSectionDataSource}
            onChangeClient={onChange}
            refreshing={this.props.clientsState.isLoading}
            isLoading={this.props.clientsState.isLoading}
            hideAddButton={
              this.props.navigation.state.params
                ? this.props.navigation.state.params.hideAddButton
                : true
            }
          />
        </View>
      </View>
    );
  }
}
export default ClientsScreen;
