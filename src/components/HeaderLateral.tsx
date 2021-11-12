import * as React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 5,
  },
});


const HeaderLateral = (props) => {
  let handlePress = props.handlePress ?
    props.handlePress : null;

  handlePress = props.params ?
    props.params.handlePress : handlePress;

  handlePress = props.navigationParams ?
    props.navigationParams.onNavigateBack : handlePress;

  return (
    <SalonTouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
      {props.button}
    </SalonTouchableOpacity>
  );
};


HeaderLateral.propTypes = {
  handlePress: PropTypes.func,
  button: PropTypes.element.isRequired,
};

HeaderLateral.defaultProps = {
  handlePress: null,
};

export default HeaderLateral;
