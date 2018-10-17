// @flow
import React from 'react';
import {
  View,
  RefreshControl,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  InputGroup,
  InputButton,
} from '../../../../components/formHelpers';

import styles from './styles';

class ServiceCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceCategories: props.serviceCategories,
      refreshing: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.serviceCategories.length !== this.props.serviceCategories.length) {
      this.updateServiceCategories(this.props.serviceCategories);
    }
  }

  onRefreshFinish = () => {
    this.setState({ refreshing: false });
  }

  keyExtractor = item => item.id;

  updateServiceCategories = serviceCategories => this.setState({ serviceCategories })

  renderItem(elem) {
    return (
      <InputGroup style={{
        flexDirection: 'row',

        height: 44,
        borderBottomWidth: 1 / 3,
        borderTopWidth: 0,
      }}
      >
        <InputButton
          icon="default"
          style={{ flex: 1 }}
          labelStyle={{ color: '#110A24' }}
          onPress={() => { this.props.handlePressServiceCategory(elem.item); }}
          label={elem.item.name}
        />
      </InputGroup>
    );
  }

  render() {
    return (

      <View style={styles.serviceCategoryListContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                this.props.onRefresh(this.onRefreshFinish);
              }
            }
            />
        }
          style={styles.serviceCategoriesList}
          data={this.state.serviceCategories}
          extraData={this.props}
          keyExtractor={this.keyExtractor}
          renderItem={elem => this.renderItem(elem)}
        />
      </View>
    );
  }
}

ServiceCategoryList.defaultProps = {
  serviceCategories: [],
};

ServiceCategoryList.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  handlePressServiceCategory: PropTypes.func.isRequired,
  serviceCategories: PropTypes.shape([]),
};

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect(mapStateToProps)(ServiceCategoryList);
