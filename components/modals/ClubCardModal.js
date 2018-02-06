import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import CustomModal from './../customModal';
import Button from './../Button';

const styles = StyleSheet.create({
  imageWrapper: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  image: { height: 99, width: 99, margin: 25 },
  titleContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  title: {
    color: '#0A274A', fontSize: 22, fontFamily: 'OpenSans-Bold', marginBottom: 8,
  },
  subTitle: { color: '#0A274A', fontSize: 15 },
  inputWrapper: { paddingHorizontal: 30, marginVertical: 20, alignSelf: 'stretch' },
  input: {
    height: 50,
    paddingHorizontal: 13,
    marginVertical: 15,
    paddingVertical: 11,
    borderColor: 'rgba(10,39,74,0.2)',
    borderWidth: 1,
  },
});

const ClubCardModal = props => (
  <CustomModal
    isVisible={props.isVisible}
    closeModal={props.closeModal}
    style={{ flex: 1 }}
  >
    <View style={styles.imageWrapper}>
      <Image source={require('./../../assets/images/clubCardModal/icon_clubcard.png')} />
    </View>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Scan Club Card</Text>
      <Text style={styles.subTitle}>Please enter the card number</Text>
    </View>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        onChangeText={props.onChangeText}
        value=""
      />
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 0 }}>
      <Button onPress={props.cancelCallback} type="light" text="Cancel" />
      <Button onPress={props.okCallback} type="primary" text="Ok" />
    </View>
  </CustomModal>
);

export default ClubCardModal;
