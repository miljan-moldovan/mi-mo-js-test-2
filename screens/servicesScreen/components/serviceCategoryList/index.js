// @flow
import React from 'react';
import { View,
  StyleSheet,
  FlatList } from 'react-native';
import { connect } from 'react-redux';

import {
  InputGroup,
  InputButton,
} from '../../../../components/formHelpers';

const styles = StyleSheet.create({
  serviceCategoriesList: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  selectedProvider: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedProviderName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  serviceCategoryListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
});

class ServiceCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceCategories: props.serviceCategories,
      selectable: props.selectable,
      refresh: false,
    };
  }

  state = {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectable: nextProps.selectable,
      refresh: true,
    });
  }
  _keyExtractor = (item, index) => item.id;


  renderItem(elem) {
    return (
      <InputGroup style={{
        flexDirection: 'row',

        height: 44,
        borderBottomWidth: 1 / 3,
        borderTopWidth: 0,
      }}
      >
        {[<InputButton
          key={Math.random().toString()}
          style={{ flex: 1 }}
          labelStyle={{ color: '#110A24' }}
          onPress={() => { this.props.handlePressServiceCategory(elem.item); }}
          label={elem.item.name}
        />]}
      </InputGroup>
    );
  }

  render() {
    return (

      <View style={styles.serviceCategoryListContainer}>
        <FlatList
          style={styles.serviceCategoriesList}
          data={this.state.serviceCategories}
          extraData={this.state.refresh}
          keyExtractor={this._keyExtractor}
          renderItem={elem => this.renderItem(elem)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect(mapStateToProps)(ServiceCategoryList);
