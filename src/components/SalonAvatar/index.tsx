import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import { CachedImage } from 'react-native-img-cache';
import styles from './style';

type SalonAvatarType = {
  image?: {
    uri: string,
  } | null,
  width: number,
  badgeColor?: string,
  borderWidth?: number,
  hasBadge?: boolean,
  borderColor?: string,
  wrapperStyle?: any,
  imageStyle?: any,
  badgeComponent?: any,
  defaultComponent?: any,
};

class SalonAvatar extends React.Component<SalonAvatarType> {

  static propTypes = {
    image: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      PropTypes.object,
    ]),
    width: PropTypes.number.isRequired,
    badgeColor: PropTypes.string,
    borderWidth: PropTypes.number,
    badgeComponent: PropTypes.element,
    defaultComponent: PropTypes.element,
    hasBadge: PropTypes.bool,
    borderColor: PropTypes.string,
    wrapperStyle: PropTypes.any,
    imageStyle: PropTypes.any,
  };

  static defaultProps = {
    image: null,
    badgeColor: 'white',
    borderWidth: 0,
    badgeComponent: null,
    defaultComponent: null,
    hasBadge: false,
    wrapperStyle: {},
    imageStyle: {},
  };

  state = {
    isLoading: false,
    isError: false,
  };

  render() {
    const {
      image,
      width,
      hasBadge,
      borderWidth,
      badgeColor,
      borderColor,
      wrapperStyle,
      badgeComponent,
      defaultComponent,
      imageStyle: imageStyleProp,
    } = this.props;

    const { isLoading, isError } = this.state;
    const badgeSize = width / 2;
    const badgeBorderRadius = badgeSize / 2;
    const badgeOffsetTop = badgeSize - (badgeSize / 5);
    const badgeOffsetRight = -(badgeSize / 1.5);

    const containerStyle = {
      width,
      height: width,
      borderRadius: width / 2,
      borderWidth: isLoading ? 0 : borderWidth,
      borderColor: isLoading ? 'transparent' : borderColor,
    };

    const defaultComponentStyle = {
      width,
      height: width,
      borderRadius: width / 2,
    };

    const imageStyle = {
      zIndex: 9999,
      width,
      height: width,
      borderRadius: width / 2,
    };

    const badgeStyle = {
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeBorderRadius,
      backgroundColor: badgeColor,
      top: badgeOffsetTop,
      right: badgeOffsetRight,
    };

    return (
      <View style={[styles.wrapperStyle, wrapperStyle]}>
        <View style={[styles.containerStyle, containerStyle]}>
          {
            !defaultComponent && isLoading &&
            <ActivityIndicator />
          }
          {
            defaultComponent && (isNull(image) || !image.uri || isError) &&
            <View style={[styles.defaultComponentStyle, defaultComponentStyle]}>{defaultComponent}</View>
          }
          {
            !isNull(image) && image.uri && !isError &&
            <CachedImage
              style={[
                imageStyle,
                imageStyleProp,
              ]}
              source={image}
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoadEnd={() => this.setState({ isLoading: false })}
              onError={() => this.setState({ isError: true })}
            />
          }
          {
            hasBadge &&
            <View style={[styles.badgeStyle, badgeStyle]}>{badgeComponent}</View>
          }
        </View>
      </View>
    );
  }
}

export default SalonAvatar;
