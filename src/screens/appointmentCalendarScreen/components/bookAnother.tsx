import * as React from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';

import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import Icon from '@/components/common/Icon';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: '#1DBF12',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
  },
  clientText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#fff',
  },
});

class BookAnother extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.height, {
      toValue: 40,
      duration: 800,
    }).start();
  }

  hide = () => {
    if (!this.ishidding) {
      this.ishidding = true;
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: 200,
      }).start(this.props.hide);
    }
  };

  render() {
    const { height } = this.state;
    const { client } = this.props;
    const clientName = client && client.name && client.name.toUpperCase();
    const clientLastName = client && client.lastName && client.lastName.toUpperCase();
    const clientName = `${clientName} ${clientLastName}`;
    return (
      <Animated.View style={[styles.container, { height }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>BOOKING ANOTHER FOR</Text>
          <Text textTransform="uppercase" style={styles.clientText}>
            {clientName}
          </Text>
        </View>
        <SalonTouchableOpacity onPress={this.hide}>
          <Icon color="#fff" size={16} name="timesCircle" type="solid" />
        </SalonTouchableOpacity>
      </Animated.View>
    );
  }
}

export default BookAnother;
