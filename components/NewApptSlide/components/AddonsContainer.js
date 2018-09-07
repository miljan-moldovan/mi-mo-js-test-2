import React from 'react';
import {
  View,
  Text,
  Animated,
} from 'react-native';
import moment from 'moment';
import { InputDivider } from '../../formHelpers';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import Icon from '../../UI/Icon';
import Colors from '../../../constants/Colors';
import styles from '../styles';

const Addon = props => (
  <SalonTouchableOpacity style={styles.addonInput} onPress={props.onPress}>
    <View style={styles.addonInputInner}>
      <Icon
        style={styles.addonIcon}
        name="levelUp"
        type="regular"
        color="black"
        size={12}
      />
      <Text style={styles.addonInputText} numberOfLines={1}>{props.title}</Text>
      {props.number > 0 && (
        <View style={styles.addonCount}>
          <Text style={styles.addonCountText}>+{props.number}</Text>
        </View>
      )}
      {props.required && (
        <Text style={styles.addonRequiredText}>REQUIRED</Text>
      )}
    </View>
    <View style={styles.addonIconContainer}>
      {props.length && (
        <Text style={styles.addonLengthText}>{props.length}</Text>
      )}
      <SalonTouchableOpacity style={styles.addonIconButton} onPress={props.onPressIcon || null}>
        <Icon
          name={props.required ? 'times' : 'angleRight'}
          type="light"
          color={Colors.defaultBlue}
          size={props.required ? 15 : 24}
        />
      </SalonTouchableOpacity>
    </View>
  </SalonTouchableOpacity>
);

const AddonsContainer = (props) => {
  const extrasArray = [...props.addons, ...props.recommended];
  const extrasLength = extrasArray.reduce((aggregator, current) => {
    if (current.maxDuration) {
      return aggregator.add(moment.duration(current.maxDuration));
    }
    return aggregator;
  }, moment.duration());
  return props.visible ? (
    <Animated.View
      style={{
        maxHeight: props.height,
        overflow: 'hidden',
      }}
    >
      <View style={styles.addonsContainer}>
        <Text style={styles.addonsTitleText}>ADD-ONS / RECOMMENDED / REQUIRED</Text>
        <View style={styles.addonsInputContainer}>
          {extrasArray.length > 0 && (
            <Addon
              title={extrasArray[0].name}
              number={extrasArray.length - 1}
              onPress={props.onPressAddons}
              length={`${extrasLength.asMinutes()} min`}
            />
          )}
          {extrasArray.length > 0 && props.required !== null && (
            <InputDivider style={styles.middleSectionDivider} />
          )}
          {props.required !== null && (
            <Addon
              required
              icon="times"
              title={props.required.name}
              onPressIcon={props.onRemoveRequired}
              length={`${moment.duration(props.required.maxDuration || props.required.duration).asMinutes()} min`}
              onPress={props.onPressRequired}
            />
          )}
        </View>
      </View>
    </Animated.View>
  ) : null;
};
export default AddonsContainer;
