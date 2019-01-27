import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
let bottomCofficient = 1.2;

if (height < 600) {
  bottomCofficient = 1.4;
}

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


  return fortyTwoPercent * bottomCofficient;
}

function setPositionToMinimalOption() {
  return fortyTwoPercent * bottomCofficient;
}

export default {
  getHeightPointFromDragHeight,
  setPositionToMinimalOption,
};
