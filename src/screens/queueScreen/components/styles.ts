import {
  StyleSheet,
} from 'react-native';

const createStyleSheet = () => StyleSheet.create({
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 0,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
  },
  queueButtonText: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
  },
  queueButtonImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
});

export default createStyleSheet;