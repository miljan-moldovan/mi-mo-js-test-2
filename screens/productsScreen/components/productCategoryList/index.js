// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';

import {
  InputGroup,
  InputButton,
} from '../../../../components/formHelpers';

const styles = StyleSheet.create({
  productCategoriesList: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  fullSize: { flex: 1 },
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
  productCategoryListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  itemRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1 / 3,
    borderTopWidth: 0,
  },
});

class ProductCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productCategories: props.productCategories,
      refreshing: false,
    };
  }

  _keyExtractor = (item, index) => item.id;

  renderItem(elem) {
    const labelColor = { flex: 1 };
    return (
      <InputGroup style={styles.itemRow}>
        <InputButton
          label={elem.item.name}
          style={styles.fullSize}
          labelStyle={labelColor}
          onPress={() => this.props.handlePressProductCategory(elem.item)}
        />
      </InputGroup>
    );
  }

  refreshControl = () => {
    this.setState({ refreshing: true });
    this.props.onRefresh(this.onRefreshFinish);
  }

  onRefreshFinish = () => {
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.productCategoryListContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshControl}
            />
          }
          style={styles.productCategoriesList}
          data={this.state.productCategories}
          extraData={this.props}
          keyExtractor={this._keyExtractor}
          renderItem={elem => this.renderItem(elem)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  productsState: state.productsReducer,
});

export default connect(mapStateToProps)(ProductCategoryList);
