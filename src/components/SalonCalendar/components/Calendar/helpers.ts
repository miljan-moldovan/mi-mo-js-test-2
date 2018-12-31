// helper that return an array with the total number of cards overlapping de one sent by params.
import {
  uniqBy,
} from 'lodash';

export const findOverlappingAppointments = (cardId, intermediateResultDict) => {
  const otherCardsOverlapping = intermediateResultDict[cardId]
    .overlappingCards.reduce(
      (accumulator, item) => [
        ...accumulator,
        ...findOverlappingAppointments(item.id, intermediateResultDict),
      ],
      [],
    );

  return uniqBy(
    [
      ...intermediateResultDict[cardId].overlappingCards,
      ...otherCardsOverlapping,
    ],
    'id',
  );
};

