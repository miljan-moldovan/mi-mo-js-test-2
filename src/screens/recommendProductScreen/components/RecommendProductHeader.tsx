import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import HeaderMiddle from '../../../components/HeaderMiddle';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    paddingTop: 3,
  },
  subTitle: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
});

const RecommendProductHeader = (props) => {
  const client = props.rootProps.navigation.getParam('client', {});
  return (
    <HeaderMiddle
      title={<Text style={styles.title}>Rec. Products</Text>}
      subTitle={<Text style={styles.subTitle}>{`${client.name} ${client.lastName}`}</Text>}
    />
  );
};

export default RecommendProductHeader;
