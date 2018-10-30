import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },

  headerTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    marginBottom: 6,
  },
  navButton: {

  },
  navButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  sortButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    // width: 'auto',
    marginTop: 7,
    marginBottom: 14,
    marginHorizontal: 10,
    flexDirection: 'row',
    flexShrink: 2,
    alignItems: 'center',
  },
  sortButtonLabel: {
    fontSize: 10,
    color: 'rgba(114,122,143,1)',
    marginLeft: 3,
  },
  sortButtonText: {
    fontSize: 10,
    color: '#1DBF12',
    marginLeft: 10,
  },
  searchContainer: {
    borderRadius: 10,
    backgroundColor: 'rgba(142,142,147,0.24)',
    height: 36,
    margin: 8,
    marginBottom: 13,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  search: {
    margin: 7,
    height: 36,
    borderWidth: 0,
    color: 'rgba(114,122,143,1)',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
