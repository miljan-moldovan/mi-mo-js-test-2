import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  textMedium: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  textNormal: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  serviceContainer: {
    borderRadius: 4,
    borderColor: 'rgba(195,214,242,0.2)',
    borderWidth: 1,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 10,
    marginBottom: 3,
    justifyContent: 'center',
    shadowColor: 'rgba(192,192,192,0.9)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    height: 82,
  },
  angleIcon: {
    fontSize: 20,
    color: '#115ECD',
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderColor: 'rgba(195,214,242,0.5)',
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  providerRound: {
    width: 26,
    marginRight: 14.5,
  },
  firstAvailable: {
    backgroundColor: '#C3D6F2',
    borderRadius: 13,
    height: 26,
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  firstAvailableText: {
    marginLeft: 5,
    color: '#115ECD',
    fontSize: 9,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  avatarDefaultComponent: {
    width: 24,
    height: 24,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#115ECD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDefaultComponentText: {
    fontSize: 10,
    color: '#115ECD',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  cancelButton: { fontSize: 14, color: 'white' },

});
