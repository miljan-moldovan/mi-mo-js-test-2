import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

const colors = {
  green: '#00CF48',
  success: '#4D5067',
  error: '#F50035',
  warning: '#D9C101',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toast: {
    width: '100%',
    position: 'absolute',
    left: 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  description: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 12,
    flex: 1,
  },
  btn: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#fff',
    padding: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export interface SalonToastObject {
  type?: string;
  timeout?: number;
  description: string;
  btnRightText?: string;
  btnLeftText?: string;
}

interface SalonToastProps extends SalonToastObject {
  hide: () => void;
  undo?: () => void;
}

interface SalonToastState {
  top: Animated.Value;
}

class SalonToast extends React.Component<SalonToastProps, SalonToastState> {
  isHiding: boolean;

  constructor(props) {
    super(props);
    this.state = {
      top: new Animated.Value(-44),
    };
  }

  componentDidMount() {
    const { timeout = 1000 } = this.props;
    Animated.timing(this.state.top, {
      toValue: 0,
      duration: 800,
    }).start(() => setTimeout(this.hide, timeout));
  }

  hide = () => {
    if (!this.isHiding) {
      this.isHiding = true;
      Animated.timing(this.state.top, {
        toValue: -44,
        duration: 600,
      }).start(this.props.hide);
    }
  };

  undo = () => {
    if (!this.isHiding) {
      this.isHiding = true;
      Animated.timing(this.state.top, {
        toValue: -44,
        duration: 600,
      }).start(this.props.undo);
    }
  };

  render() {
    const { top } = this.state;
    const { type, description, btnRightText, btnLeftText } = this.props;
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.toast, { backgroundColor: colors[type], top }]}
        >
          <Text style={styles.description}>{description}</Text>
          <View style={styles.btnContainer}>
            {btnLeftText &&
            <TouchableOpacity onPress={this.undo}>
              <Text style={styles.btn}>{btnLeftText}</Text>
            </TouchableOpacity>}
            {btnRightText &&
            <TouchableOpacity onPress={this.hide}>
              <Text style={styles.btn}>{btnRightText}</Text>
            </TouchableOpacity>}
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default SalonToast;
