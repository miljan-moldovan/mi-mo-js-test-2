// @flow
import * as React from 'react';
import {View, RefreshControl, FlatList, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {filter} from 'lodash';
import FontAwesome, {Icons} from 'react-native-fontawesome';

import {
  InputGroup,
  InputDivider,
  InputButton,
} from '../../../../components/formHelpers';

import styles from './styles';
import Colors from '../../../../constants/Colors';
import SalonFlatList from '@/components/common/SalonFlatList';
import SalonListItem from '@/components/common/SalonListItem';

class ServiceCategoryList extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      serviceCategories: props.serviceCategories,
      refreshing: false,
    };
  }

  componentDidUpdate (prevProps) {
    if (
      prevProps.serviceCategories.length !== this.props.serviceCategories.length
    ) {
      this.updateServiceCategories (this.props.serviceCategories);
    }
  }

  onRefreshFinish = () => {
    this.setState ({refreshing: false});
  };

  keyExtractor = item => item.id;

  updateServiceCategories = serviceCategories =>
    this.setState ({serviceCategories});

  renderItem = ({item}) => {
    const serviceCategory = this.props.servicesState.selectedService
      ? filter (this.state.serviceCategories, {
          services: [{id: this.props.servicesState.selectedService.id}],
        })[0]
      : {};

    const checked = serviceCategory.id === elem.item.id;

    const highlightStyle = checked ? {color: Colors.selectedGreen} : {};
    const onPress = () => this.props.handlePressServiceCategory (elem.item);
    const icons = checked
      ? [
          {
            name: 'checkCircle',
            color: Colors.selectedGreen,
            type: 'solid',
          },
        ]
      : [
          {
            name: 'angleRight',
            type: 'light',
            color: Colors.defaultGrey,
          },
        ];
    return (
      <SalonListItem
        key={`service_list_item_${item.id}`}
        textStyle={highlightStyle}
        icons={icons}
        onPress={onPress}
      />
    );
  };

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: Colors.divider,
        marginLeft: 16,
        height: StyleSheet.hairlineWidth,
      }}
    />
  );

  render () {
    return (
      <View style={styles.serviceCategoryListContainer}>
        <SalonFlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState ({refreshing: true});
                this.props.onRefresh (this.onRefreshFinish);
              }}
            />
          }
          data={this.state.serviceCategories}
          extraData={this.props}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderSeparator}
          keyExtractor={this.keyExtractor}
          renderItem={elem => this.renderItem (elem)}
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
  serviceCategories: PropTypes.shape ([]),
};

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect (mapStateToProps) (ServiceCategoryList);
