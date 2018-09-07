import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ActivityIndicator, FlatList, AppState } from 'react-native';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import styles from './styles';
import { Store } from '../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import storeActions from '../../actions/store';
import * as authAction from '../../actions/login';
import ErrorsView from '../../components/ErrorsView';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import salonSearchHeaderActions from '../../reducers/searchHeader';

class SelectStoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const leftButtonOnPress = () => {};
    const rightButtonOnPress = () => {};
    return {
      header: () => (<SalonSearchHeader
        title="Stores"
        leftButton={null}
        leftButtonOnPress={() => { leftButtonOnPress(navigation); }}
        rightButton={null}
        rightButtonOnPress={() => { rightButtonOnPress(navigation); }}
        hasFilter={false}
        containerStyle={{
          paddingHorizontal: 20,
        }}
      />),
    };
  }

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

    this.props.salonSearchHeaderActions.setFilterAction(searchText => this.filterList(searchText));
    this.props.salonSearchHeaderActions
      .setIgnoredNumberOfLetters(0);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    Store.getListOfStores().then((stores) => {
      this.updateStores(stores);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.salonSearchHeaderState.showFilter &&
      !this.props.salonSearchHeaderState.showFilter) {
      this.filterList();
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
  }

  updateStores = (stores) => {
    this.setState({
      showLoadingSpinner: false,
      allStores: stores,
      stores,
    });
  }

  filterList = (searchText) => {
    if (searchText) {
      this.setState({
        stores: filter(this.state.allStores, item => (
          item.name.indexOf(searchText) !== -1
        )),
      });
    } else {
      this.setState({
        stores: this.state.allStores,
      });
    }
  }

  handleSelectStore = (id) => {
    this.props.storeActions.setStore(id, this.setStoreCallback);
  }
  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && this.state.appState === 'active') {
      this.props.authActions.logout();
    }
    this.setState({ appState: nextAppState });
  }

  renderListItem = ({ item }) => (
    <SalonTouchableOpacity onPress={() => this.handleSelectStore(item.id)}>
      <Text style={styles.listItem}>{item.name}</Text>
    </SalonTouchableOpacity>
  );

  renderContent = () => (
    <View style={{ flex: 1 }}>
      {this.state.hasError && <ErrorsView error={this.state.errorMessage} />}
      <View style={styles.listWrapper}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={styles.listColumnWrapper} />
          )}
          ListFooterComponent={() => (
            <View style={styles.listColumnWrapper} />
          )}
          data={this.state.stores}
          renderItem={this.renderListItem}
        />
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.showLoadingSpinner ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <ActivityIndicator />
          </View>
        ) : this.renderContent()}
      </View>
    );
  }
}

SelectStoreScreen.propTypes = {
  storeActions: PropTypes.shape({
    setStore: PropTypes.func.isRequired,
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
};

const mapStateToProps = state => ({
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
  authActions: bindActionCreators({ ...authAction }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(SelectStoreScreen);
