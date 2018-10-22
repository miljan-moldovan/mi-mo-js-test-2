import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  itemRow: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
  inputRow: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  providerName: {
    fontSize: 14,
    marginLeft: 7,
    color: Colors.defaultBlack,
    fontFamily: 'Roboto-Medium',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  timeLeftText: {
    fontSize: 11,
    textAlign: 'right',
    fontFamily: 'Roboto-Light',
    color: Colors.dividerGrey,
  },
  letterListContainer: {
    paddingTop: 77,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  letterListText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Roboto-Regular',
    color: Colors.defaultGrey,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHeaderButton: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  headerSubTitle: {
    fontFamily: 'Roboto',
    color: Colors.white,
    fontSize: 10,
  },
  leftButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  listItemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginLeft: 16,
    backgroundColor: Colors.divider,
  },
  selectedGreen: {
    color: Colors.selectedGreen,
  },
  estimatedTimeContainer: { flex: 1, alignItems: 'flex-end' },
  selectedIconContainer: { flex: 1, alignItems: 'center' },
  searchBarContainer: {
    paddingTop: 3,
    paddingBottom: 3.1,
    paddingHorizontal: 8,
  },
  flexRow: { flexDirection: 'row' },
  fullSizeColumn: { flexDirection: 'column', flex: 1 },
  whiteBackground: {
    backgroundColor: Colors.white,
  },
});
export default styles;
