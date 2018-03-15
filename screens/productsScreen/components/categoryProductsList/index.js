// @flow
import React from 'react';
import { View,
  StyleSheet,
  Text,
  FlatList } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputButton,
} from '../../../../components/formHelpers';

const styles = StyleSheet.create({
  categoryProductsList: {
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
  CategoryProductsListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  sizeLabelText: {
    fontSize: 11,
    lineHeight: 22,
    marginRight: 9,
    width: 30,
    color: '#0C4699',
    textAlign: 'left',
    fontFamily: 'Roboto-Regular',
  },
  priceLabelText: {
    fontSize: 14,
    lineHeight: 22,
    marginRight: 10,
    width: 50,
    color: '#727A8F',
    textAlign: 'right',
    fontFamily: 'Roboto-Regular',
  },
  inputRow: {
    height: 44,
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkIcon: {
    fontSize: 15,
    marginLeft: 2,
    textAlign: 'center',
    color: '#1DBF12',
  },
});

class CategoryProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryProducts: props.categoryProducts,
      //  selectedProvider: props.walkInState.selectedProvider,
      selectable: props.selectable,
      refresh: false,
    };
  }

  state = {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
    //  selectedProvider: this.props.walkInState.selectedProvider,
      selectable: nextProps.selectable,
      refresh: true,
    });
  }
  _keyExtractor = (item, index) => item.id;

  renderItem = elem => (
    <InputGroup style={{
        flexDirection: 'row',
        height: 44,
        borderBottomWidth: 1 / 3,
        borderTopWidth: 0,
      }}
    >
      {[<InputButton
        noIcon
        key={Math.random().toString()}
        style={{ flex: 1 }}
        labelStyle={{ color: '#110A24' }}
        onPress={this.props.onChangeProduct ? () => { this.props.productsActions.setSelectedProduct(elem.item); this.props.onChangeProduct(elem.item); } : () => {}}
        label={elem.item.name}
        children={
          <View style={styles.inputRow}>
            <Text style={styles.sizeLabelText}>{elem.item.size}</Text>
            <Text style={styles.priceLabelText}>{elem.item.price}</Text>
            {elem.item === this.props.productsState.selectedProduct &&
              <FontAwesome style={styles.checkIcon}>{Icons.checkCircle}
              </FontAwesome>
            }
          </View>

          }
      />]}
    </InputGroup>
  )

  render() {
    return (

      <View style={styles.CategoryProductsListContainer}>
        <FlatList
          style={styles.categoryProductsList}
          data={this.state.categoryProducts}
          extraData={this.state.refresh}
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

export default connect(mapStateToProps)(CategoryProductsList);
