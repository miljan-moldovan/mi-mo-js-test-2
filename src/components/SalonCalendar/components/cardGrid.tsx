import * as React from 'react';
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
import DateTime from '@/constants/DateTime';

export default class CardGrid extends React.Component {

  renderCards = (cards, headerIndex, headerId, showAvailability) => {
    if (cards && cards.length) {
      return cards.map(
        card =>
          card.isBlockTime
            ? this.props.renderBlock(card, headerIndex, headerId, showAvailability)
            : this.props.renderCard(card, headerIndex, headerId),
      );
    }
    return null;
  };

  render() {
    const { cardsArray, headerData, selectedFilter, selectedProvider, overlappingCardsMap, showAvailability } = this.props;
    const isCanBeOnlyUser = selectedFilter === 'providers' || selectedFilter === 'deskStaff';
    const gridCard = headerData.map((item, index) => {
      let headerId = item.id;
      if (isCanBeOnlyUser && selectedProvider !== 'all') {
        headerId = item.format(DateTime.date);
      }
      return this.renderCards(
        chain(cardsArray[headerId])
          .orderBy(
            card =>
              get(
                overlappingCardsMap,
                [headerId, card.id, 'overlappingCardsLength'],
                0,
              ),
            'asc',
          )
          .value(),
        index,
        headerId,
        showAvailability,
      );
    });
    return <React.Fragment>{gridCard}</React.Fragment>;
  }
}
