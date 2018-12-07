import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  clientText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
    flex: 1,
    flexWrap: 'wrap',
  },
  serviceText: {
    color: '#1D1E29',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: 'normal',
    paddingHorizontal: 8,
  },
  header: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  container: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
  },
  stripesContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 4,
  },
  fullSize: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  clientContainer: {
    flexDirection: 'row',
    paddingVertical: 1,
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
  },
  resizePosition: {
    left: -13,
    bottom: -27,
  },
  multiProviderFix: {
    marginTop: 4,
  },
  assistantContainer: {
    position: 'absolute',
    top: 6,
    right: 4,
    width: 15,
    backgroundColor: 'rgba(47, 49, 66, 0.3)',
    borderRadius: 2,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  assistantText: {
    fontSize: 10,
    lineHeight: 10,
    minHeight: 10,
    textAlign: 'center',
    margin: 0,
    padding: 0,
    color: '#fff',
    transform: [{ rotate: '-90deg' }],
  },
  requestedStyle: {
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginTop: 2,
    marginRight: 2,
  },
});