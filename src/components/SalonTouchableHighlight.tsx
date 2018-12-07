import debounce from 'lodash.debounce'; // 4.0.8
import * as React from 'react';
import { TouchableHighlight } from 'react-native';

const SalonTouchableHighlight = (WrappedComponent) => {
  class PreventDoubleClick extends React.PureComponent {
    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = debounce(this.debouncedOnPress, this.props.wait ? this.props.wait : 700, { leading: true, trailing: false });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `SalonTouchableHighlight(${WrappedComponent.displayName || WrappedComponent.name})`;
  return PreventDoubleClick;
};

export default SalonTouchableHighlight(TouchableHighlight);
