import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import styles from './style';

const DeniedAccessApptBookComponent = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>You don't have permissions</Text>
      {props.children}
    </View>
  );
};
export default DeniedAccessApptBookComponent;
