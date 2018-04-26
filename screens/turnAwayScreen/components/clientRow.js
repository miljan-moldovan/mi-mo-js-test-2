import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

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
    fontSize: 20,
    color: '#727A8F',
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
        <Text style={styles.textData}>{`${client.name} ${client.lastName}`}</Text>
      </View>
    );
  }
  return (<Text style={styles.label}>Optional</Text>);
};

const clientRow = props => (
  <SalonTouchableOpacity style={{ flex: 1 }} onPress={props.onPress}>
    <View style={styles.row} >
      <Text style={styles.label}>Client</Text>
      <View style={styles.dataContainer}>
        <View style={styles.buttonStyle}>
          {renderClient(props.client, props.onCrossPress)}
        </View>
      </View>
      <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
    </View>
  </SalonTouchableOpacity>
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
