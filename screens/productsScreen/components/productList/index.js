import React from 'react';
import { View,
  SectionList,
  RefreshControl,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ProductListItem from './productListItem';
import ProductListHeader from './productListHeader';

import ListLetterFilter from '../../../../components/listLetterFilter';

const ITEM_HEIGHT = 43;
const HEADER_HEIGHT = 38;

const abecedary = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E7E7E7',
  },
  topBar: {
    height: HEADER_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

class ProductList extends React.Component {
  static compareByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  static getByValue(arr, value, attr) {
    const results = [];
    for (let i = 0, iLen = arr.length; i < iLen; i += 1) {
      if (arr[i][attr] === value) {
        results.push(arr[i]);
      }
    }
    return results.length > 0 ? results : null;
  }

  static products(products) {
    const productsLetters = [];

    // {data: [...], title: ...},

    for (let i = 0; i < products.length; i += 1) {
      const productCategory = products[i];

      let firstLetter = productCategory.name.substring(0, 1).toUpperCase();
      const isNumber = !isNaN(parseInt(firstLetter, 10));
      firstLetter = isNumber ? '#' : firstLetter;

      const result = ProductList.getByValue(
        productsLetters,
        productCategory.name, 'title',
      );

      if (result) {
        result[0].data.concat(productCategory.products);
      } else {
        productsLetters.push({ data: productCategory.products, title: productCategory.name, firstLetter });
      }
    }

    return productsLetters;
  }

  static renderSeparator() {
    return (<View
      style={{
            height: 1,
            width: '100%',
            backgroundColor: '#C0C1C6',
          }}
    />);
  }


  static renderSection(item) {
    return (<View key={Math.random().toString()} style={styles.topBar}>
      <ProductListHeader header={item.section.title} />
    </View>);
  }


  constructor(props) {
    super(props);

    const products = props.products.sort(ProductList.compareByName);

    this.state = {
      dataSource: ProductList.products(products),
      boldWords: props.boldWords,
      refreshing: false,
    };
  }
    state:{
      products:[],
    };


    componentDidMount() {
      const wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
      wait.then(() => {
        this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: 1 });
      });
    }

    componentWillReceiveProps(nextProps) {
      const products = nextProps.products.sort(ProductList.compareByName);
      this.setState({
        dataSource: ProductList.products(products),
        boldWords: nextProps.boldWords,
      });
    }


      renderItem = obj => (
        <ProductListItem
          {...this.props}
          key={Math.random().toString()}
          product={obj.item}
          height={ITEM_HEIGHT}
          boldWords={this.state.boldWords}
          onPress={this.props.onChangeProduct ? () => { this.props.productsActions.setSelectedProduct(obj.item); this.props.onChangeProduct(obj.item); } : () => {}}
        />)

      keyExtractor = (item, index) => item.id;

      onRefreshFinish = () => {
        this.setState({ refreshing: false });
      }

      scrollToIndex = (letter) => {
        let total = 0;
        let found = false;

        for (let i = 0; i < abecedary.length; i += 1) {
          const letterProducts = ProductList.getByValue(
            this.state.dataSource,
            abecedary[i], 'firstLetter',
          );

          if (letter.toUpperCase() === abecedary[i]) {
            total += HEADER_HEIGHT;
            found = letterProducts;
          }

          if (letterProducts && !found) {
            for (let x = 0; x < letterProducts.length; x += 1) {
              total += HEADER_HEIGHT;
              total += letterProducts[x].data.length * ITEM_HEIGHT;
            }
          }
        }

        if (found) {
          this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: total });
        }
      }

      render() {
        return (
          <View style={styles.container}>

            <SectionList
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
              keyExtractor={this.keyExtractor}
              key={Math.random().toString()}
              style={{ height: '100%', flex: 1 }}
              enableEmptySections
              keyboardShouldPersistTaps="always"
              initialNumToRender={this.state.dataSource.length}
              ref={(ref) => { this.sectionListRef = ref; }}
              sections={this.state.dataSource}
              renderItem={this.renderItem}
              stickySectionHeadersEnabled
              getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                  )}
              extraData={this.props}
              renderSectionHeader={item => ProductList.renderSection(item)}
              ItemSeparatorComponent={() => ProductList.renderSeparator()}
            />

            <ListLetterFilter
              onPress={(letter) => { this.scrollToIndex(letter); }}
            />

          </View>
        );
      }
}

const mapStateToProps = state => ({
  productsState: state.productsReducer,
});

export default connect(mapStateToProps)(ProductList);
