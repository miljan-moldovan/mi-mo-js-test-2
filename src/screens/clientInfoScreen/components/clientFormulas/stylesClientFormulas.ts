import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  formulasScroller: {
    flex: 9,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  formulaHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  formulaHeaderRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  topSearchBar: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 53,
  },
  tagsBar: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 38,
  },
  formulasContainer: {
    paddingTop: 0,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formulaTags: {
    height: 17,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  showDeletedButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showDeletedText: {
    color: '#115ECD',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  showDeletedButtonContainer: {
    minHeight: 40,
    marginBottom: 40,
  },
  formulaText: {
    color: '#5E5F61',
    fontSize: 10,
    fontFamily: 'Roboto-Light',
    fontWeight: 'normal',
    marginVertical: 5,
  },
  formulaTextTitle: {
    color: '#2E3032',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  formulaAuthor: {
    color: '#2F3142',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  formulaBy: {
    paddingHorizontal: 5,
    color: '#4D5067',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  checkIcon: {
    width: 10,
    height: 13,
    marginLeft: 5,
    paddingTop: 1,
    //  resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  dotsIcon: {
    width: 13,
    height: 16,
    marginLeft: 5,
    paddingTop: 1,
    // resizeMode: 'contain',
    tintColor: '#115ECD',
  },
  formulaTypeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#082e66',
  },
  formulaType: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  fixedBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  fixedBtnText: {
    fontSize: 12,
    lineHeight: 12,
    color: '#FFFFFF',
  },
  fixedBtnIconContainer: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#4D5067',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootStyle: {
    height: 56,
    width: 56,
    bottom: 25,
    borderRadius: 56 / 2,
    backgroundColor: '#115ECD',
  },
  searchStyle: {
    paddingHorizontal: 8,
  },
  scrollViewStyle: {
    alignSelf: 'stretch',
  },
  floatListStyle: {
    alignSelf: 'stretch',
    marginTop: 4,
  },
  salonCardStyle: {
    marginVertical: 2,
    marginHorizontal: 8,
  },
  salonTouchableStyle: {
    marginRight: 10,
  },
  angleRight: {
    marginLeft: 10,
    color: '#115ECD',
    fontSize: 22,
  },
  bodyChildren: {
    flexDirection: 'column',
    height: 33,
  },
});


