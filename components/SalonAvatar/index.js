import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import { CachedImage } from 'react-native-img-cache';

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapperStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // width: '100%',
  },
});

export default class SalonAvatar extends React.Component {
  state = {
    isLoading: false,
  }

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
    const { isLoading } = this.state;
    const badgeSize = width / 2;
    const badgeBorderRadius = badgeSize / 2;
    const badgeOffsetTop = badgeSize - (badgeSize / 5);
    const badgeOffsetRight = -(badgeSize / 1.5);
    const containerStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      width,
      height: width,
      borderRadius: width / 2,
      borderWidth: isLoading ? 0 : borderWidth,
      borderColor: isLoading ? 'transparent' : borderColor,
    };
    const defaultComponentStyle = {
      position: 'absolute',
      zIndex: 999,
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
      position: 'absolute',
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeBorderRadius,
      backgroundColor: badgeColor,
      top: badgeOffsetTop,
      right: badgeOffsetRight,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    };
    return (
      <View style={[styles.wrapperStyle, wrapperStyle]}>
        <View style={containerStyle}>
          {
            !defaultComponent && isLoading &&
            <ActivityIndicator size={width} />
          }
          {
            defaultComponent && (isNull(image) || !image.uri) &&
            <View style={defaultComponentStyle}>{defaultComponent}</View>
          }
          {
            !isNull(image) && image.uri &&
            <CachedImage
              style={[
                imageStyle,
                imageStyleProp,
              ]}
              source={image}
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoadEnd={() => this.setState({ isLoading: false })}
            />
          }
          {
            hasBadge &&
            <View style={badgeStyle}>{badgeComponent}</View>
          }
        </View>
      </View>
    );
  }
}
SalonAvatar.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    null,
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
SalonAvatar.defaultProps = {
  image: null,
  badgeColor: 'white',
  borderWidth: 0,
  badgeComponent: null,
  defaultComponent: null,
  hasBadge: false,
  wrapperStyle: {},
  imageStyle: {},
  borderColor: '',
};
