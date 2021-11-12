import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  panelIcon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelIconBtn: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: '#727A8F',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  panelIconBtnDisabled: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: 'rgb(229, 229, 229)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  panelIconText: {
    marginTop: 7,
    color: '#727A8F',
    fontSize: 9,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  plusIconContainer: {
    position: 'absolute',
    paddingVertical: 1,
    paddingHorizontal: 2,
    top: 19,
    backgroundColor: '#727A8F',
  },
});
