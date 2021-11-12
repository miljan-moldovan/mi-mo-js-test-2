import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  panelContainer: {
    backgroundColor: '#CDCED2',
    flexDirection: 'column',
    zIndex: 99999,
    height: 500,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  panelBlurredSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panelTopSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 345,
  },
  panelBottomSection: {
    backgroundColor: '#F3F4F4',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 130,
  },
  panelTopArrow: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconStyle: {
    width: 35,
    height: 10,
  },
  weekJumpContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '90%',
  },
  weekJump: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width === 320 ? 40 : 48,
    height: Dimensions.get('window').width === 320 ? 40 : 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  weekJumpText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#115ECD',
  },
  weekJumpTitle: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Roboto-bold',
  },
  weekJumpTitleContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
