import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, isNaN, sortBy, isNumber } from 'lodash';

import Icon from '../../components/UI/Icon';
import LoadingOverlay from '../../components/LoadingOverlay';
import WordHighlighter from '../../components/wordHighlighter';
import ListLetterFilter from '../../components/listLetterFilter';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Colors from '../../constants/Colors';
import styles from './styles';

const ITEM_HEIGHT = 44;

class PromotionsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Promotions',
    headerLeft: (
      <SalonTouchableOpacity onPress={navigation.goBack}>
        <Text style={styles.headerButton}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const { selectedPromotion = null } = props.navigation.state.params || {};
    this.state = {
      searchText: '',
      selectedPromotion,
    };
  }

  componentDidMount() {
    const {
      promotionsActions: {
        getProductPromos,
        getServicePromos,
      },
    } = this.props;
    switch (this.mode) {
      case 'product':
        return getProductPromos();
      case 'service':
      default:
        return getServicePromos();
    }
  }

  onChangeSearchText = searchText => this.setState({ searchText })

  onChangePromotion = (item) => {
    const {
      dismissOnSelect,
      onChangePromotion = (itm => itm),
    } = this.props.navigation.state.params || {};
    onChangePromotion(item);
    if (dismissOnSelect) {
      this.props.navigation.goBack();
    }
  }

  get mode() {
    const { mode = 'service' } = this.props.navigation.state.params || {};
    return mode;
  }

  get currentData() {
    const {
      promotionsState: { servicePromos, productPromos },
    } = this.props;
    const { searchText } = this.state;
    let currentData = [];
    switch (this.mode) {
      case 'product':
        currentData = productPromos;
        break;
      case 'service':
      default:
        currentData = servicePromos;
        break;
    }
    const sorted = sortBy(currentData, itm => get(itm, 'name', '').toLowerCase());
    if (searchText !== '') {
      return sorted.filter(itm => get(itm, 'name', '').toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }
    return sorted;
  }

  getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })

  scrollToLetter = (letter) => {
    for (let i = 0; i <= this.currentData.length; i += 1) {
      const firstChar = get(this.currentData[i], 'name', '').toUpperCase().charAt(0);
      if (letter === '#' && isNumber(firstChar)) {
        this.listRef.scrollToIndex({ index: i });
        break;
      }
      if (firstChar === letter.toUpperCase()) {
        this.listRef.scrollToIndex({ index: i });
        break;
      }
    }
  }

  keyExtractor = item => get(item, 'id');

  renderSeparator = () => <View style={styles.itemSeparator} />

  renderItem = ({ item }) => {
    const { selectedPromotion, searchText } = this.state;
    const isSelected = (
      isNumber(get(selectedPromotion, 'id', null)) && isNumber(get(item, 'id', null))
      && item.id === selectedPromotion.id
    );
    const name = get(item, 'name', '');
    const selectedStyle = isSelected ? styles.selectedText : {};
    const icon = isSelected ? (
      <Icon
        type="solid"
        name="checkCircle"
        color={Colors.selectedGreen}
        size={14}
      />
    ) : null;
    const onPress = () => this.onChangePromotion(item);
    return (
      <SalonTouchableOpacity
        onPress={onPress}
        style={styles.itemRow}
      >
        <WordHighlighter
          numberOfLines={1}
          highlight={searchText}
          highlightStyle={styles.highlightText}
          style={[styles.itemText, styles.container, selectedStyle]}
        >
          {name}
        </WordHighlighter>
        {icon}
      </SalonTouchableOpacity>
    );
  }

  render() {
    const {
      searchText,
    } = this.state;
    const {
      promotionsState: { isLoading },
    } = this.props;
    return (
      <View style={[styles.container, styles.whiteBg]}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <SalonSearchBar
          marginVertical={0}
          searchText={searchText}
          placeHolderText="Search"
          searchIconPosition="left"
          borderColor="transparent"
          fontColor={Colors.defaultGrey}
          iconsColor={Colors.defaultGrey}
          onChangeText={this.onChangeSearchText}
          placeholderTextColor={Colors.defaultGrey}
          containerStyle={styles.searchBarContainer}
          backgroundColor="rgba(142, 142, 147, 0.24)"
        />
        <View style={[styles.container, styles.flexRow]}>
          <FlatList
            data={this.currentData}
            style={[styles.container, styles.marginRight]}
            ref={(ref) => { this.listRef = ref; }}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            getItemLayout={this.getItemLayout}
            ItemSeparatorComponent={this.renderSeparator}
          />
          <ListLetterFilter onPress={this.scrollToLetter} />
        </View>
      </View>
    );
  }
}
PromotionsScreen.propTypes = {
  promotionsActions: PropTypes.shape({
    getProductPromos: PropTypes.func,
    getServicePromos: PropTypes.func,
  }).isRequired,
  promotionsState: PropTypes.shape({
    isLoading: PropTypes.bool,
    servicePromos: PropTypes.array,
    productPromos: PropTypes.array,
  }).isRequired,
};
export default PromotionsScreen;
