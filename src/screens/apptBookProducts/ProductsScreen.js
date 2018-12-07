import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import { debounce } from 'lodash';
import LoadingOverlay from '../../components/LoadingOverlay';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import SalonSearchBar from '../../components/SalonSearchBar';

import Icon from '@/components/common/Icon';
import styles from './styles';

class ProductsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const isFocused = params.isFocused || false;
    const defaultOnChange = txt => txt;
    const onChangeText = params.onChangeText || defaultOnChange;
    const title = 'Products';
    // return {
    //   title,
    //   headerLeft: (
    //     <SalonTouchableOpacity
    //       onPress={() => navigation.goBack()}
    //     >
    //       <Text style={styles.headerButtonText}>Cancel</Text>
    //     </SalonTouchableOpacity>
    //   ),
    // };
    return {
      header: props => (
        <SalonSearchBar
          placeHolderText="Search"
          containerStyle={{
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: !isFocused ? 7 : 15,
            paddingRight: !isFocused ? 7 : 2,
            paddingVertical: 5,
          }}
          marginVertical={!isFocused ? 0 : 0}
          placeholderTextColor={!isFocused ? '#727A8F' : '#FFFFFF'}
          showCancel={isFocused}
          searchIconPosition="left"
          iconsColor={!isFocused ? '#727A8F' : '#FFFFFF'}
          fontColor={!isFocused ? '#727A8F' : '#FFFFFF'}
          borderColor="transparent"
          backgroundColor={!isFocused ? 'rgba(142,142,147,0.24)' : '#0C4699'}
          onChangeText={searchText => onChangeText(searchText)}
          // onFocus={() => { this.showSuggestions(); }}
          // handleCancel={this.props.leftButtonOnPress}
        />
      ),
    };
  }

  constructor(props) {
    super(props);

    props.navigation.setParams({ onChangeText: debounce(this.onChangeSearch, 500) });
    this.state = {
      search: '',
    };
  }
  componentDidMount() {
    this.props.getProducts();
  }

  onChangeSearch = search => this.setState({ search })
  
  onPressCategory = id => id;

  renderCategoryItem = ({ item: { id, name } }) => (
    <SalonTouchableOpacity
      style={styles.listItem}
      onPress={() => this.onPressCategory(id)}
    >
      <Text style={styles.listItemText}>{name}</Text>
      <Icon
        name="chevronRight"
        color="#727A8F"
        size={12}
      />
    </SalonTouchableOpacity>
  )

  render() {
    const {
      isLoading,
      products,
    } = this.props.productsState;
    const Separator = () => <View style={styles.listItemSeparator} />;
    return (
      <View style={styles.container}>
        {
          isLoading ? <LoadingOverlay /> : null
        }
        <Text style={styles.listItemText}>{this.state.search}</Text>
        <FlatList
          data={this.props.categoryList}
          keyExtractor={itm => itm.id}
          renderItem={this.renderCategoryItem}
          ItemSeparatorComponent={() => <Separator />}
        />
      </View>
    );
  }
}
export default ProductsScreen;
