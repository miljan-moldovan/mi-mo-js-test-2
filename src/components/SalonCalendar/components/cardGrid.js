import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {
  values,
  forEach,
  zipObject,
  chain,
  filter,
  get,
  uniqBy,
  keyBy,
  groupBy,
  mapValues,
  reverse,
  mergeWith,
} from 'lodash';

export default class CardGrid extends Component {
  shouldComponentUpdate(nextProps) {
    return !nextProps.isLoading && (this.props.isLoading !== nextProps.isLoading
        || this.props.selctedFilter !== nextProps.selctedFilter || this.props.cardActive !== nextProps.cardActive);
  }

  renderCards = (cards, headerIndex, headerId) => {
    if (cards && cards.length) {
      return cards.map (
        card =>
          card.isBlockTime
            ? this.props.renderBlock (card, headerIndex, headerId)
            : this.props.renderCard (card, headerIndex, headerId)
      );
    }
    return null;
  };

  render() {
    const { cardsArray, headerData, selectedFilter, selectedProvider, overlappingCardsMap } = this.props;
    const gridCard = headerData.map ((item, index) => {
      let headerId = item.id;
      if (
        selectedFilter === 'providers' &&
        selectedProvider !== 'all'
      ) {
        headerId = item.format (DateTime.date);
      }
      return this.renderCards (
        chain (cardsArray[headerId])
          .orderBy (
            card =>
              get (
                overlappingCardsMap,
                [headerId, card.id, 'overlappingCardsLength'],
                0
              ),
            'asc'
          )
          .value (),
        index,
        headerId
      );
    });
    return <React.Fragment>{gridCard}</React.Fragment>;
  }
}
