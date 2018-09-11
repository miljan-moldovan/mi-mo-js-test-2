import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  serviceTimeContainer: {
    // fontSize: 12,
    // fontFamily: 'Roboto-Regular',
    // color: '#000',
    marginBottom: 8,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
  },
  serviceTime: {
    // fontFamily: 'OpenSans-Bold',
  },
  serviceClockIcon: {
    fontSize: 12,
    // padding: 0,
    color: '#7E8D98',
    paddingRight: 7,
  },
  waitingTime: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  circularCountdown: {
    marginRight: 5,
    marginTop: 3,
    alignItems: 'center',
  },
  waitingTimeTextTop: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  infoContainer: {
    backgroundColor: '#e2e9f1',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C1C6',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 19,
    paddingTop: 13,
    minHeight: 123,
  },
  infoTitleText: {
    color: '#4D5067',
    fontSize: 9,
    lineHeight: 14,
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingHorizontal: 8,
  },
  titleText: {
    marginTop: 23,
    color: '#4D5067',
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 8,
    marginBottom: 5,
    fontFamily: 'Roboto-Medium',
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  employeeText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: '#2F3142',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  caretIcon: {
    lineHeight: 22,
    marginLeft: 10,
  },
  price: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
    letterSpacing: 0,
  },
  addButtonText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto-Regular',
    marginLeft: 5,
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
  promoDescription: {
    fontSize: 10,
    lineHeight: 14,
    color: '#FFA300',
    fontFamily: 'Roboto-Light',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  totalLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: '#C0C1C5',
    fontFamily: 'Roboto-Medium',
  },
  totalAmount: {
    fontSize: 16,
    lineHeight: 19,
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
  },
  bottomButtonWrapper: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonIcon: {
    fontSize: 16,
    lineHeight: 16,
    color: 'white',
  },
  bottomButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
    lineHeight: 10,
    marginTop: 8,
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  notArrivedContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 30,
    bottom: 5,
  },
  finishedContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 30,
    bottom: 5,
  },
  finishedTime: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedTimeText: {
    fontSize: 9,
    fontFamily: 'Roboto-Medium',
    color: '#4D5067',
  },
  finishedTimeFlag: {
    backgroundColor: '#31CF48',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  headerButton: {
    fontSize: 14,
    lineHeight: 22,
    color: 'white',
  },
  fullSize: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  clientCardContainer: { marginHorizontal: 0 },
  clientCardBody: { paddingHorizontal: 16, paddingVertical: 0 },
  clientCardInput: {
    flex: 1,
    height: 44,
    paddingRight: 0,
    justifyContent: 'flex-start',
  },
});
export default styles;
