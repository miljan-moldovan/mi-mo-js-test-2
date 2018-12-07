
import Colors from '../../constants/Colors';

const getBottomColorIphoneX = (route) => {
  switch (route) {
    case 'AppointmentDetails':
      return Colors.defaultGrey;
    case 'Login':
    case 'ForgotPassword':
      return Colors.defaultBlue;
    default:
      return Colors.lightGrey;
  }
};
export default getBottomColorIphoneX;
