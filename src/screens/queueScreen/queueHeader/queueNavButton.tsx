import * as React from 'react';
import {
  View,
} from 'react-native';
import Icon from '@/components/common/Icon';
import createStyleSheet from './styles';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

interface Props {
  onPress: any;
  icon: any;
  type: any;
  style: any;
}

class QueueNavButton extends React.PureComponent<Props>  {
  render() {
    return (
      <SalonTouchableOpacity onPress={this.props.onPress} style={[{ justifyContent: 'flex-end' }, this.props.style]}>
        <View style={{ height: 20, width: 20 }}>
          <Icon name={this.props.icon} type={this.props.type} style={createStyleSheet().navButton} />
        </View>
      </SalonTouchableOpacity>
    );
  }
}

export default QueueNavButton;
