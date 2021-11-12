import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  providerPicture: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderColor: '#67A3C7',
    borderWidth: 2,
    marginRight: 5,
  },
  itemContainer: {
    // width: '100%',
    height: 79,
    borderBottomWidth: 1,
    borderBottomColor: '#B2AFAA',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    alignItems: 'center',

  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
  },
  serviceTitle: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 18,
  },
  serviceTime: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 12,
  },
  servicePrice: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 16,
    marginLeft: 'auto',
  },
  providerLabel: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 11,
  },
  providerName: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 16,
  },
  promoCode: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 18,
  },
  promoDiscount: {
    fontFamily: 'OpenSans-Regular',
    color: '#CE3333',
    fontSize: 16,
    marginLeft: 'auto',
  },
  deleteButton: {
    width: 250,
    height: 50,
    marginTop: 62,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'transparent',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DE406A',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
  },
  headerButton: {
    fontSize: 14,
    color: 'white',
  },
});

export default styles;
