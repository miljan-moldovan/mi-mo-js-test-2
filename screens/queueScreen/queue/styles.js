import { StyleSheet, Dimensions } from 'react-native';

const smallDevice = Dimensions.get('window').width === 320;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  itemContainer: {
    // width: '100%',
    // minHeight: smallDevice ? 126 : 110,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(29,29,38,1)',
    borderRadius: 4,
    // borderWidth: 1,
    // borderColor: '#ccc',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.1,
    paddingVertical: 8,
    // maxHeight: 94,
    flex: 1,
    // box-shadow: 0 0 2px 0 rgba(0,0,0,0.1);
  },
  wrapperStyle: {
    paddingVertical: 3,
  },
  itemSummary: {
    marginLeft: 10,
    flex: smallDevice ? 5 : 4,
    justifyContent: 'flex-end',
  },
  itemIcons: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#111415',
  },
  serviceName: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    // marginTop: 4,
  },
  serviceTimeContainer: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#000',
    // marginTop: 11,
    // marginBottom: 8,
    flexDirection: 'row',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  serviceTime: {},
  chevronRightIcon: {
    fontSize: 12,
    color: '#000000',
  },
  waitingTime: {
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: 16,
    minWidth: 56,
  },
  circularCountdown: {
    marginLeft: 'auto',
    marginRight: smallDevice ? 25 : 52,
    alignItems: 'center',
  },
  circularCountdownContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingTimeTextTop: {
    fontSize: 9,
    fontFamily: 'Roboto-Regular',
    color: '#999',
    fontWeight: '500',
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceClockIcon: {
    fontSize: 12,
    color: '#7E8D98',
    paddingRight: 7,
  },
  notArrivedContainer: {
    height: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 10,
    bottom: 0,
  },
  returningContainer: {
    height: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 10,
    bottom: 0,
  },
  finishedContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 30,
    bottom: 0,
  },
  finishedTime: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: 16,
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
  header: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 22,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#4D5067',
    fontSize: 14,
  },
  headerCount: {
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    fontSize: 11,
  },
  chevron: {
    position: 'absolute',
    top: 17,
    right: 10,
    fontSize: 15,
    color: '#115ECD',
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  modalBusyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#111415',
  },
});
