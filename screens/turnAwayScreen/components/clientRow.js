import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import SalonIcon from '../../../components/SalonIcon';

const styles = StyleSheet.create({
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Roboto-Medium',
    color: '#727A8F',
    fontSize: 14,
  },
  textData: {
    fontFamily: 'Roboto-Medium',
    color: '#110A24',
    fontSize: 14,
  },
  iconStyle: {
    tintColor: '#727A8F',
    marginLeft: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  clientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const renderClient = (client, onCrossPress) => {
  if (client) {
    return (
      <View style={styles.clientContainer}>
        <Text style={styles.textData}>{client.name}</Text>
        <TouchableOpacity onPress={onCrossPress}>
          <SalonIcon icon="cross" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    );
  }
  return (<Text style={styles.label}>Optional</Text>);
};

const clientRow = props => (
  <View style={styles.row} >
    <Text style={styles.label}>Client</Text>
    <View style={styles.dataContainer}>
      <View style={styles.buttonStyle}>
        { renderClient(props.client, props.onCrossPress) }
        <TouchableOpacity onPress={props.onPress}>
          <SalonIcon icon="caretRight" style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

clientRow.propTypes = {
  onPress: PropTypes.func.isRequired,
  client: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onCrossPress: PropTypes.func.isRequired,
};

clientRow.defaultProps = {
  client: null,
};

export default clientRow;
