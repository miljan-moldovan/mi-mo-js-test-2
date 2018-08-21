import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const onePercent = (height / 100);
const fortyTwoPercent = onePercent * 42;
const sixtyPercent = onePercent * 60;
const fullHeight = height;

function getHeightPointFromDragHeight(afterDraggHeight) {
  if (afterDraggHeight >= fullHeight ||
    afterDraggHeight >= (sixtyPercent + (fortyTwoPercent / 2))) {
    return fullHeight;
  } else if (afterDraggHeight >= fortyTwoPercent + (fortyTwoPercent / 2) &&
            afterDraggHeight < (sixtyPercent + (fortyTwoPercent / 2))) {
    return sixtyPercent;
  } else if (afterDraggHeight < fortyTwoPercent / 1.5) {
    return 0;
  }


  return fortyTwoPercent;
}

function setPositionToMinimalOption() {
  return fortyTwoPercent;
}

export default {
  getHeightPointFromDragHeight,
  setPositionToMinimalOption,
};
