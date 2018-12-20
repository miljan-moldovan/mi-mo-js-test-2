import debounce from 'lodash.debounce'; // 4.0.8
import * as React from 'react';
import { TouchableOpacity, ViewStyle, RegisteredStyle } from 'react-native';

type IProps = {
  onPress: () => void,
  wait?: number,
  disabled?: boolean,
  style?: RegisteredStyle<ViewStyle>,
};

const SalonTouchableOpacity = (WrappedComponent) => {
  class PreventDoubleClick extends React.PureComponent<IProps> {
    static displayName = `SalonTouchableOpacity(${WrappedComponent.displayName || WrappedComponent.name})`;
    debouncedOnPress = () => {
      if (this.props.disabled !== true) {
        this.props.onPress && this.props.onPress();
      }
    };

    onPress = debounce(this.debouncedOnPress, this.props.wait ? this.props.wait : 700, {
      leading: true,
      trailing: false,
    });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  return PreventDoubleClick;
};

export default SalonTouchableOpacity(TouchableOpacity);
