import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    color: '#fff',
    fontSize: 20,

  },
  estText: {
    fontFamily: 'OpenSans-Regular',
    color: '#fff',
    fontSize: 12,
  },
  estTextBold: {
    fontFamily: 'OpenSans-Bold',
  },
});

const walkinHeader = (props) => {
  console.log('headerprops', props);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.estText}>Est wait time:
        <Text style={styles.estTextBold}>{` ${props.navigation.state.params.estimatedTime} min`}</Text>
      </Text>
    </View>
  );
};

walkinHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default walkinHeader;
