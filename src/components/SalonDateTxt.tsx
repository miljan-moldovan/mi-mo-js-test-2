import * as React from 'react';
import moment from 'moment';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  text: {
    color: '#1D1D26',
  },

});


const salonDateTxt = props => (
  <Text style={[styles.text, {
          fontSize: props.valueSize,
          color: props.valueColor,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
        }]}
  >
    { moment(props.value).isValid() ?
      moment(props.value).format(props.dateFormat) : props.value}
  </Text>
);

salonDateTxt.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  valueColor: PropTypes.string,
  valueSize: PropTypes.number,
  dateFormat: PropTypes.string,
  fontWeight: PropTypes.string,
  fontFamily: PropTypes.string,
};

salonDateTxt.defaultProps = {
  valueColor: '#000000',
  valueSize: 14,
  dateFormat: 'YYYY-MM-DD',
  fontFamily: 'Roboto',
  fontWeight: 'normal',
};

export default salonDateTxt;
