import React from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(4, 4, 15, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: 270,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#115ECD',
    fontSize: 17,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#110A24',
    fontSize: 13,
    textAlign: 'center',
  },
  btnContainer: {
    borderTopWidth: 1,
    borderColor: 'rgb(202, 202, 218)',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgb(202, 202, 218)',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLeftText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 17,
    color: '#4D5067',
  },
  btnRightText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 17,
    color: '#115ECD',
  },
});

const salonAlert = ({ title, description, visible, btnLeftText, btnRightText, onPressLeft, onPressRight}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={() => {
      alert('Modal has been closed.');
    }}
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.btnContainer}>
            <TouchableOpacity onPress={onPressLeft} style={styles.btn}><Text style={styles.btnLeftText}>{btnLeftText}</Text></TouchableOpacity>
            <View style={styles.btnDivider}/>
            <TouchableOpacity style={styles.btn} onPress={onPressRight}><Text style={styles.btnRightText}>{btnRightText}</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default salonAlert;
