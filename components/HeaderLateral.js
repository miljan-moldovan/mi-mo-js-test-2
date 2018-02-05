import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
});


const HeaderLateral = (props) => {
  const handlePress = props.params ?
    props.params.handlePress : null;

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
      {props.button}
    </TouchableOpacity>
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
