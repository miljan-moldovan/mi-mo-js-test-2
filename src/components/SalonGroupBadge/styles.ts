import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#082E66',
    borderWidth: 1,
    paddingLeft: 4,
    marginLeft: 2,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    color: '#2F3142',
    marginHorizontal: 2,
  },
  dollarContainer: {
    height: '100%',
    paddingHorizontal: 4,
    backgroundColor: '#082E66',
    borderTopRightRadius: 7.5,
    borderBottomRightRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
