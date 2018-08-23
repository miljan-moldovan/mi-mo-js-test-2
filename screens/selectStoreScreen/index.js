import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ActivityIndicator, FlatList, AppState } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Store } from '../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import storeActions from '../../actions/store';
import * as authAction from '../../actions/login';
import ErrorsView from '../../components/ErrorsView';

class SelectStoreScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    stores: [],
    showLoadingSpinner: true,
    hasError: false,
    errorMessage: '',
    appState: AppState.currentState,
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    Store.getListOfStores().then((stores) => {
      this.updateStores(stores);
    });
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
    this.setState({ showLoadingSpinner: false, stores });
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
      <FlatList
        data={this.state.stores}
        renderItem={this.renderListItem}
      />
    </View>
  );

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.headerStyle}>Select store</Text>
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
};

const mapStateToProps = () => ({});

const mapActionsToProps = dispatch => ({
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
  authActions: bindActionCreators({ ...authAction }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(SelectStoreScreen);
