import * as React from 'react';
import {
  View,
  Text,
  StyleProp,
  TextStyle,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';

import Icon from '@/components/common/Icon';
import { IconProps } from '@/components/common/Icon/interfaces';
import styles from './styles';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';

export interface SalonListItemProps {
  onPress: () => void;
  text?: string;
  icons?: IconProps[];
  height?: number;
  children?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  key?: string;
}

const SalonListItem = (props: SalonListItemProps) => {
  const {
    icons,
    text,
    children,
    onPress,
    textStyle,
    height,
    isLoading,
    style,
    key = '',
  } = props;
  const containerStyle = height ? [styles.container, { height }] : styles.container;
  const contentStyle = style ? [styles.content, style] : styles.content;
  const content = text ? <Text style={[styles.itemText, textStyle]}>{text}</Text> : children;
  return (
    <SalonTouchableOpacity key={key} style={containerStyle} onPress={onPress}>
      <View style={contentStyle}>{content}</View>
      <View style={styles.icons}>
        {
          isLoading
            ? <ActivityIndicator style={styles.marginLeft} />
            : icons && icons.map(iconProps => <Icon {...iconProps} style={styles.marginLeft} />)
        }
      </View>
    </SalonTouchableOpacity>
  );
};
export default SalonListItem;
