import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(4, 4, 15, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: 270,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#115ECD',
    fontSize: 17,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#110A24',
    fontSize: 13,
    textAlign: 'center',
  },
  btnContainer: {
    borderTopWidth: 1,
    borderColor: 'rgb(202, 202, 218)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgb(202, 202, 218)',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLeftText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 17,
    color: '#4D5067',
  },
  btnRightText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 17,
    color: '#115ECD',
  },
});
