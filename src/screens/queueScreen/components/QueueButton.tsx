// @flow
import * as React from 'react';
import { Image, Text, View, Alert } from 'react-native';
import SalonTouchableHighlight from '../../../components/SalonTouchableHighlight';
import createStyleSheet from './styles';
const styles = createStyleSheet();

export const QueueButton = (props) => {
  const {
    onPress, left, type,
  } = props;
  const { title, image, color } = type;
  const _onPress = onPress || (() => Alert.alert(title, '[Not Implemented]'));
  return (
    <SalonTouchableHighlight
      style={[left ? styles.leftSwipeItem : styles.rightSwipeItem, { backgroundColor: color }]}
      onPress={_onPress}
    >
      <View
        style={{
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color,
        }}
      >
        <Image source={image} 
          style={{
            width: 40,
            height: 40,
            marginBottom: 4,
          }} 
        />
        <Text style={styles.queueButtonText}>{title}</Text>
      </View>
    </SalonTouchableHighlight>
  );
};

export const QueueButtonTypes = {
  noShow: {
    title: 'No Show',
    image: require('../../../assets/images/queue/no_show_icon.png'),
    color: '#666767',
  },
  returnLater: {
    title: 'Return Later',
    image: require('../../../assets/images/queue/return-icon.png'),
    color: '#666767',
  },
  clientReturned: {
    title: 'Client Returned',
    image: require('../../../assets/images/queue/client_returned_icon.png'),
    color: '#666767',
  },
  service: {
    title: 'Service',
    image: require('../../../assets/images/queue/service-icon.png'),
    color: '#68A3C5',
  },
  walkout: {
    title: 'Walk Out',
    image: require('../../../assets/images/queue/walkout-icon.png'),
    color: '#68A3C5',
  },
  checkin: {
    title: 'Check-In',
    image: require('../../../assets/images/queue/checkIn-icon.png'),
    color: '#8A9295',
  },
  uncheckin: {
    title: 'UnCheck-In',
    image: require('../../../assets/images/queue/uncheckIn-icon.png'),
    color: '#8A9295',
  },
  notesFormulas: {
    title: 'Notes & Formulas',
    image: require('../../../assets/images/queue/formulas-icon.png'),
    color: '#666767',
  },
  toWaiting: {
    title: 'To Waiting',
    image: require('../../../assets/images/queue/icon_to_waiting.png'),
    color: '#68A3C5',
  },
  finishService: {
    title: 'Finish Service',
    image: require('../../../assets/images/queue/icon_finish.png'),
    color: '#68A3C5',
  },
  checkout: {
    title: 'Checkout',
    image: require('../../../assets/images/queue/checkIn-icon.png'),
    color: '#666767',
  },
  undoFinish: {
    title: 'Undo Finish',
    image: require('../../../assets/images/queue/icon_finish.png'),
    color: '#68A3C5',
  },
  rebook: {
    title: 'Rebook',
    image: require('../../../assets/images/queue/uncheckIn-icon.png'),
    color: '#8A9295',
  },
};
