import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const colors = [
  { header: '#ff8200', content: '#ffcd99', border: '#f9a71e' },
  { header: '#9e2fff', content: '#e2b2ff', border: '#b684ee' },
  { header: '#00c9c7', content: '#83f2f0', border: '#1ad9d8' },
  { header: '#006bf5', content: '#bad8ff', border: '#5c9cfa' },
  { header: '#0dce00', content: '#9fef99', border: '#2adb1e' },
];

const appointmentBlock = ({ providers, appointment, initialTime }) => {
  const color = Math.floor(Math.random() * 4);
  const { clientName, serviceName, fromTime, toTime, id } = appointment;
  const start = moment(fromTime, 'HH:mm');
  const end = moment(toTime, 'HH:mm');
  const initial = moment(initialTime, 'HH:mm')
  const height = (moment.duration(end.diff(start)).asMinutes() / 15) * 30 - 1;
  const top = 40 + (moment.duration(start.diff(initial)).asMinutes() / 15) * 30;
  const left = providers.findIndex(provider => provider.id === appointment.employee.id) * 130;
  return (
    <View key={id} style={{ height, position: 'absolute', top, left, width: 129, borderRadius: 4, borderColor: colors[color].border, backgroundColor: colors[color].content, borderWidth: 1, }}>
      <View style={{ height: 4, borderRadius: 2, width: '100%', backgroundColor: colors[color].header }} />
      <Text numberOfLines={1} style={{ color: '#2F3142', fontFamily: 'Roboto', fontSize: 12, fontWeight: 'bold' }}>{clientName}</Text>
      <Text numberOfLines={1} style={{ color: '#1D1E29', fontFamily: 'Roboto', fontSize: 11, fontWeight: 'normal' }}>{serviceName}</Text>
    </View>
  );
}

export default appointmentBlock;
