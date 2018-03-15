import React from 'react';
import { View,
  Text,
  TouchableHighlight,
  SectionList,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ProductListItem from './productListItem';
import ProductListHeader from './productListHeader';

const ITEM_HEIGHT = 43;
const HEADER_HEIGHT = 38;

const abecedary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E7E7E7',
  },
  productList: {
    backgroundColor: '#FFF',
    flex: 10,
  },
  listContainer: {
    flex: 9,
    flexDirection: 'row',
    height: '100%',
  },
  list: {
    flex: 10,
    backgroundColor: '#FFF',
    height: '100%',
  },
  guideContainer: {
    flex: 1 / 2,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
  },
  letterContainer: {
    backgroundColor: 'transparent',
  },
  topBar: {
    height: HEADER_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  foundLetter: {
    color: '#727A8F',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  letter: {
    color: '#727A8F',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },

});

class ProductList extends React.Component {
  static compareByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  static getByValue(arr, value, attr) {
    for (let i = 0, iLen = arr.length; i < iLen; i += 1) {
      if (arr[i][attr] === value) return arr[i];
    }
    return null;
  }


  static products(products) {
    const productsLetters = [];

    // {data: [...], title: ...},

    for (let i = 0; i < products.length; i += 1) {
      const productCategory = products[i];
      const result = ProductList.getByValue(
        productsLetters,
        productCategory.name, 'title',
      );

      if (result) {
        result.data.concat(productCategory.products);
      } else {
        productsLetters.push({ data: productCategory.products, title: productCategory.name });
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
      products,
      dataSource: ProductList.products(products),
      letterGuide: [],
      boldWords: props.boldWords,
    };
  }

    state:{
      products:[]
    };


    componentWillMount() {
      this.setState({ letterGuide: this.renderLetterGuide() });
    }

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

      scrollToIndex = (section, letter) => {
        let total = 0;

        for (let i = 0; i < abecedary.length; i += 1) {
          const letterProducts = ProductList.getByValue(
            this.state.dataSource,
            abecedary[i], 'title',
          );

          if (letter.toUpperCase() === abecedary[i]) {
            total += HEADER_HEIGHT;
            break;
          }

          if (letterProducts) {
            total += HEADER_HEIGHT;
            total += letterProducts.data.length * ITEM_HEIGHT;
          }
        }


        this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: total });
      }

      renderItem = obj => (
        <ProductListItem
          {...this.props}
          key={Math.random().toString()}
          product={obj.item}
          height={ITEM_HEIGHT}
          boldWords={this.state.boldWords}
          onPress={this.props.onChangeProduct ? () => { this.props.productsActions.setSelectedProduct(elem.item); this.props.onChangeProduct(elem.item); } : () => {}}
        />)

      renderLetterGuide = () => {
        const productsLetters = [];

        for (let i = 0; i < this.state.products.length; i += 1) {
          const product = this.state.products[i];
          if (productsLetters.indexOf(product.name.substring(0, 1).toUpperCase()) === -1) {
            productsLetters.push(product.name.substring(0, 1).toUpperCase());
          }
        }

        const letterGuide = [];

        for (let i = 0; i < abecedary.length; i += 1) {
          const letter = abecedary[i];

          let letterComponent = <Text style={styles.letter}>{letter}</Text>;

          if (productsLetters.indexOf(letter) > -1) {
            letterComponent = <Text style={styles.foundLetter}>{letter}</Text>;
          }

          letterGuide.push(<TouchableHighlight
            underlayColor="transparent"
            key={Math.random().toString()}
            onPress={() => { this.scrollToIndex((i), letter); }}
          >
            <View style={styles.letterContainer}>{letterComponent}</View>
          </TouchableHighlight>);
        }

        return (letterGuide);
      }

      keyExtractor = (item, index) => item.id;

      render() {
        return (
          <View style={styles.container}>

            <View style={styles.listContainer}>
              <View style={styles.list}>
                <SectionList
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
              </View>
              {/* <View style={styles.guideContainer}>
                {this.state.letterGuide}
              </View> */}
            </View>
          </View>
        );
      }
}

const mapStateToProps = state => ({
  productsState: state.productsReducer,
});

export default connect(mapStateToProps)(ProductList);
