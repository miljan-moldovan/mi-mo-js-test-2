import * as React from 'react';
import { View, Modal, Text, TouchableOpacity, Alert } from 'react-native';
import styles from './style';

const SalonAlert = ({ title, description, visible, btnLeftText, btnRightText, onPressLeft, onPressRight }) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
    }}
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.btnContainer}>
          {
            onPressLeft && renderButton(onPressLeft, btnLeftText, 'btnLeftText')
          }
          {
            onPressLeft && onPressRight && <View style={styles.btnDivider}/>
          }
          {
            onPressRight && renderButton(onPressRight, btnRightText, 'btnRightText')
          }
        </View>
      </View>
    </View>
  </Modal>
);

const renderButton = (onPress, text, style) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles[style]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SalonAlert;
