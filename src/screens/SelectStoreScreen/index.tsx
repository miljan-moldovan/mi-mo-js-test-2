import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import {
  View,
  Text,
  AppState,
} from 'react-native';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import styles from './styles';

import { Store } from '@/models/common';

import { Store as StoreAPI } from '@/utilities/apiWrapper';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import storeActions from '@/redux/actions/store';
import * as authAction from '@/redux/actions/login';
import ErrorsView from '@/components/ErrorsView';
import SalonSearchHeader from '@/components/SalonSearchHeader';
import salonSearchHeaderActions from '@/redux/reducers/searchHeader';
import SalonFlatList from '@/components/common/SalonFlatList';
import Icon from '@/components/common/Icon';
import Colors from '@/constants/Colors';
import SalonListItem from '@/components/common/SalonListItem';

class SelectStoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let leftButton = null;
    let leftButtonOnPress = () => { };
    if (navigation.state.params && navigation.state.params.storeId) {
      leftButton = <Text style={styles.leftButtonText}>Cancel</Text>;
      leftButtonOnPress = navigation.state.params.leftButtonOnPress;
    }

    const rightButtonOnPress = () => { };
    return {
      header: () => (
          <SalonSearchHeader
            title="Stores"
            leftButton={leftButton}
            leftButtonOnPress={() => {
              leftButtonOnPress(navigation);
            }}
            rightButton={null}
            rightButtonOnPress={() => {
              rightButtonOnPress(navigation);
            }}
            hasFilter={false}
          />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      allStores: [],
      stores: [],
      showLoadingSpinner: true,
      hasError: false,
      errorMessage: '',
      appState: AppState.currentState,
    };

    this.props.navigation.setParams({
      storeId: props.currentStore.storeId,
      leftButtonOnPress: props.storeActions.cancelSelectStore,
    });
    this.props.salonSearchHeaderActions.setFilterAction(searchText =>
      this.filterList(searchText)
    );
    this.props.salonSearchHeaderActions.setIgnoredNumberOfLetters(0);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    StoreAPI.getListOfStores().then((stores: Store) => {
      this.updateStores(stores);
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.salonSearchHeaderState.showFilter &&
      !this.props.salonSearchHeaderState.showFilter
    ) {
      this.filterList('');
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  setStoreCallback = (success, errorMessage) => {
    if (!success) {
      this.setState({
        hasError: true,
        errorMessage,
      });
    }
  };

  updateStores = stores => {
    this.setState({
      showLoadingSpinner: false,
      allStores: stores,
      stores,
    });
  };

  filterList = searchText => {
    if (searchText) {
      this.setState({
        stores: filter(
          this.state.allStores,
          item => item.name.indexOf(searchText) !== -1
        ),
      });
    } else {
      this.setState({
        stores: this.state.allStores,
      });
    }
  };

  handleSelectStore = id => {
    this.props.storeActions.setStore(id, this.setStoreCallback);
  };

  handleAppStateChange = nextAppState => {
    if (
      nextAppState.match(/inactive|background/) &&
      this.state.appState === 'active'
    ) {
      this.props.authActions.logout();
    }
    this.setState({ appState: nextAppState });
  };

  renderListItem = ({ item }) => {
    const selectedStore = this.props.currentStore.storeId === item.id;
    const onPress = () => this.handleSelectStore(item.id);
    const textStyle = selectedStore ? styles.selectedItem : {};
    const icon = selectedStore ? [{
      name: 'checkCircle',
      type: 'solid',
      color: Colors.selectedGreen,
    }] : [];
    return (
      <SalonListItem
        text={item.name}
        onPress={onPress}
        textStyle={textStyle}
        icons={icon}
      />
    );
  };

  render() {
    return (
      <View style={styles.contentWrapper}>
        {this.state.hasError && <ErrorsView error={this.state.errorMessage} />}
        <SalonFlatList
          isLoading={this.state.showLoadingSpinner}
          keyExtractor={item => get(item, 'id')}
          data={this.state.stores}
          renderItem={this.renderListItem}
        />
      </View>
    );
  }
}

SelectStoreScreen.propTypes = {
  storeActions: PropTypes.shape({
    setStore: PropTypes.func.isRequired,
    cancelSelectStore: PropTypes.func.isRequired,
  }).isRequired,
  authActions: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }).isRequired,
  salonSearchHeaderActions: PropTypes.shape({
    setFilterAction: PropTypes.func.isRequired,
    setIgnoredNumberOfLetters: PropTypes.func.isRequired,
  }).isRequired,
  salonSearchHeaderState: PropTypes.shape({
    showFilter: PropTypes.bool.isRequired,
  }).isRequired,
  currentStore: PropTypes.shape({
    storeId: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  currentStore: state.storeReducer,
});

const mapActionsToProps = dispatch => ({
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
  authActions: bindActionCreators({ ...authAction }, dispatch),
  salonSearchHeaderActions: bindActionCreators(
    { ...salonSearchHeaderActions },
    dispatch
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(SelectStoreScreen);
