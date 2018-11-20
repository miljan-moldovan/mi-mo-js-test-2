// @flow
import React from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
  InputGroup,
  InputDivider,
  InputButton,
} from '../../../../components/formHelpers';

import styles from './styles';
import Colors from '../../../../constants/Colors';

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

  renderItem = (elem) => {
    const serviceCategory = this.props.servicesState.selectedService ?
    filter(this.state.serviceCategories, { services: [ { id: this.props.servicesState.selectedService.id } ]})[0] : {};

    const checked = serviceCategory.id === elem.item.id

    const highlightStyle = checked
      ?  { color: Colors.selectedGreen } :{ color: '#110A24' };


    return (
      <InputButton
        icon="default"
        key={Math.random().toString()}
        style={{ height: 44, paddingLeft: 16 }}
        labelStyle={highlightStyle}
        onPress={() => { this.props.handlePressServiceCategory(elem.item); }}
        label={elem.item.name}
      >
      { checked &&
        <FontAwesome style={styles.checkIcon}>
          {Icons.checkCircle}
        </FontAwesome>
      }
      </InputButton>
    );
  }

  renderSeparator = () => <View style={{ backgroundColor: Colors.divider, marginLeft: 16, height: StyleSheet.hairlineWidth }} />

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
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderSeparator}
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
