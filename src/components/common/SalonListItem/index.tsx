import * as React from 'react';
import {
  View,
  Text,
  StyleProp,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import Icon, { IconProps } from '@/components/common/Icon';
import styles from './styles';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';

export interface SalonListItemProps {
  onPress: () => void;
  text?: string;
  icons?: IconProps[];
  height?: number;
  children?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}

const SalonListItem = (props: SalonListItemProps) => {
  const {
    icons,
    text,
    children,
    onPress,
    textStyle,
    height,
  } = props;
  const containerStyle = height ? [styles.container, { height }] : styles.container;
  const content = text ? <Text style={[styles.itemText, textStyle]}>{text}</Text> : children;
  return (
    <SalonTouchableOpacity style={containerStyle} onPress={onPress}>
      <View style={styles.content}>{content}</View>
      <View style={styles.icons}>
        {
          icons.map(iconProps => <Icon {...iconProps} style={styles.marginLeft} />)
        }
      </View>
    </SalonTouchableOpacity>
  );
};
export default SalonListItem;
