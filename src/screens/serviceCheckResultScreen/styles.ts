import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

export default StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  headerTitleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'Roboto-Medium',
  },
  headerSubtitleText: {
    fontSize: 11,
    color: 'white',
  },
  headerLeftButton: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightButton: {
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Roboto',
  },
  marginLeft: {marginLeft: 8},
  robotoMedium: {fontFamily: 'Roboto-Medium'},
  inputGroup: {marginTop: 17, paddingRight: 22},
  errorText: {
    color: Colors.defaultBlack,
    fontSize: 14,
    lineHeight: 44,
    marginLeft: 6,
    fontFamily: 'Roboto-Medium',
  },
  resultContainer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resultRow: {flex: 1, flexDirection: 'row'},
  resultEmployeeText: {
    color: Colors.defaultBlack,
    fontSize: 14,
    lineHeight: 44,
    marginLeft: 6,
    fontFamily: 'Roboto-Medium',
  },
  resultService: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultServiceDuration: {
    color: Colors.darkBlue,
    fontSize: 11,
    lineHeight: 44,
    fontFamily: 'Roboto-Regular',
  },
  resultServicePrice: {
    color: Colors.defaultGrey,
    fontSize: 14,
    marginLeft: 26,
    lineHeight: 44,
  },
});
