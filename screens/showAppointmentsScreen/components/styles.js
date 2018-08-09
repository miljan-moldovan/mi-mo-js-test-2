import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#4D5067',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  activeSection: {
    color: '#1DBF12',
  },
  card: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1,
    paddingLeft: 8,
    paddingRight: 12,
  },
  divider: {
    width: 2,
    backgroundColor: '#00C9C7',
    marginVertical: 2,
    alignItems: 'stretch',
    marginHorizontal: 12,
  },
  timeContainer: {
    paddingVertical: 12,
  },
  startText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 18,
    color: '#2E3032',
    fontWeight: '500',
  },
  endText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 18,
    color: '#727A8F',
    fontWeight: '500',
  },
  body: {
    flex: 1,
    paddingVertical: 12,
  },
  serviceText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 16,
    color: '#2E3032',
    fontWeight: '500',
  },
  apptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  avatarStyle: {
    marginRight: 6,
  },
  employeeText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 22,
    color: '#2F3142',
  },
  storeText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 16,
    color: '#2E3032',
  },
  angleRight: {
    marginVertical: 15,
    color: '#115ECD',
    fontSize: 12,
  },
});

export default styles;
