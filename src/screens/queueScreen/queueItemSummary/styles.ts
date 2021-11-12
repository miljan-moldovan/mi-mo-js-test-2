import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const createStyleSheet = () => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
  },
  header: {
    backgroundColor: '#115ECD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 19,
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingTop: 15,
    ...ifIphoneX({
      paddingBottom: 30,
    }, {}),
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
  nameText: {
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    color: '#115ECD',
    fontSize: 20,
  },
  clockIcon: {
    fontSize: 12,
    color: '#c8c8c8',
    marginRight: 5,
  },
  angleIcon: {
    fontSize: 12,
    marginHorizontal: 8,
    color: '#111415',
  },
  timeText: {
    fontSize: 11,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  remTimeText: {
    fontSize: 10,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: 10,
    maxHeight: 430,
  },
  btnContainer: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  btnBottom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#727A8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    color: '#fff',
    fontSize: 26,
  },
  btnbottomText: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#727A8F',
    lineHeight: 9,
    marginTop: 5,
  },
  btnGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStartService: {
    marginLeft: 4,
  },
  btnDisabled: {
    backgroundColor: '#C0C1C6',
  },
  hideBtn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  bookedbyWebStyle: {
    backgroundColor: '#115ECD',
    width: 16,
    height: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 2,
  },
  bookedbyWebText: { fontWeight: '700', color: '#FFFFFF', fontSize: 8 },
  clientIcon: { marginLeft: 5 },
});

export default createStyleSheet;