import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
  },
  header: {
    height: 86.5,
    backgroundColor: 'rgb(227, 233, 241)',
    flexDirection: 'row',
    paddingHorizontal: 17,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
  },
  clientName: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#111415',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  serviceInfo: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#4D5067',
    lineHeight: 13,
    marginBottom: 7,
  },
  timeInfo: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#000000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronRightIcon: {
    marginHorizontal: 6.5,
  },
  clockIcon: {
    marginRight: 5,
  },
  apptInfo: {
    flex: 1,
  },
  dateContainer: {
    paddingTop: 4,
    backgroundColor: '#fff',
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#4D5067',
    lineHeight: 18,
  },
  monthText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#115ECD',
    lineHeight: 10,
  },
  footer: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#727A8F',
    lineHeight: 18,
    marginHorizontal: 17,
    marginTop: 6,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 14,
    color: 'white',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#fff',
  },
  btnTextDisabled: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.3)',
  },
  btn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    paddingTop: 23,
    paddingBottom: 8,
  },
});

export default styles;
