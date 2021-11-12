import * as React from 'react';
import {Animated, Platform, Text, StyleSheet, Easing} from 'react-native';

import SalonAvatar from '../../../components/SalonAvatar';
import Icon from '@/components/common/Icon';
import getEmployeePhotoSource
  from '../../../utilities/helpers/getEmployeePhotoSource';
import {DefaultAvatar} from '../../../components/formHelpers';

const styles = StyleSheet.create ({
  row: {
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },

  image: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },

  text: {
    fontSize: 14,
    color: '#110A24',
    fontFamily: 'Roboto',
    fontWeight: '500',
    flex: 1,
  },
  borderTop: {
    borderTopColor: '#C0C1C6',
    borderTopWidth: 1,
  },
});

export default class Row extends React.PureComponent {
  constructor (props) {
    super (props);

    this._active = new Animated.Value (0);

    this._style = {
      ...Platform.select ({
        ios: {
          transform: [
            {
              scale: this._active.interpolate ({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          shadowRadius: this._active.interpolate ({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate ({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: this._active.interpolate ({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing (this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number (nextProps.active),
      }).start ();
    }
  }

  render () {
    const {data, active} = this.props;
    const containerStyles = active
      ? [styles.row, this._style, styles.borderTop]
      : [styles.row, this._style];
    const image = getEmployeePhotoSource (data);
    return (
      <Animated.View style={containerStyles}>
        {/* <Image source={{ uri: data.image }} style={styles.image} /> */}
        <SalonAvatar
          wrapperStyle={styles.image}
          width={30}
          borderWidth={1}
          borderColor="transparent"
          image={image}
          defaultComponent={<DefaultAvatar provider={data} />}
        />
        <Text style={styles.text}>{data.fullName}</Text>
        <Icon name="bars" size={14} color="#C0C1C6" />
      </Animated.View>
    );
  }
}
