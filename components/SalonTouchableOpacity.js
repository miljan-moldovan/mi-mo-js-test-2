import debounce from 'lodash.debounce'; // 4.0.8
import React from 'react';
import { TouchableOpacity } from 'react-native';

const SalonTouchableOpacity = (WrappedComponent) => {
  class PreventDoubleClick extends React.PureComponent {
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = debounce(this.debouncedOnPress, this.props.wait ? this.props.wait : 700, { leading: true, trailing: false });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName || WrappedComponent.name})`;
  return PreventDoubleClick;
};

export default SalonTouchableOpacity(TouchableOpacity);
