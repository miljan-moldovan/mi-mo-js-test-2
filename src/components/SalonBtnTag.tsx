import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '@/components/common/Icon';
import SalonTouchableHighlight from './SalonTouchableHighlight';

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginHorizontal: 2,
    width: 70,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: 'Roboto',
    marginHorizontal: 5,
  },
  icon: {
    marginLeft: 5,
    paddingTop: 1,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
});

class SalonBtnTag extends React.Component<any, any> {

  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    valueSize: PropTypes.number,
    tagHeight: PropTypes.number,
    iconSize: PropTypes.number,
    onPress: PropTypes.func,
    activeStyle: PropTypes.shape({
      icon: PropTypes.string,

    }),
    inactiveStyle: PropTypes.shape({
      icon: PropTypes.string,

    }),
  };

  static defaultProps = {
    valueSize: 14,
    tagHeight: 24,
    iconSize: null,
    activeStyle: {
      backgroundColor: '#1DBF12',
      valueColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      icon: 'check',
      iconSize: 10,
    },
    inactiveStyle: {
      backgroundColor: '#FFFFFF',
      valueColor: '#727A8F',
      icon: 'square',
      iconColor: '#727A8F',
      iconSize: 15,
    },
    onPress: () => {},
  };

  constructor(props) {
    super(props);
    const tagStyle = props.isVisible ? props.activeStyle : props.inactiveStyle;
    this.state = { tagStyle };
  }

  componentWillReceiveProps(nextProps) {
    const tagStyle = nextProps.isVisible ? nextProps.activeStyle : nextProps.inactiveStyle;
    this.setState = { tagStyle };
  }

  render() {
    const onPress = this.props.onPress ? this.props.onPress : null;
    const { tagStyle } = this.state;
    return (
      <SalonTouchableHighlight
        // @ts-ignore
        onPress={() => onPress(this.props.value)}
        underlayColor="transparent"
        style={styles.btnContainer}
      >
        <View
          style={
            [
              styles.container,
              {
                backgroundColor: tagStyle.backgroundColor,
                height: this.props.tagHeight,
              },
            ]
          }
        >
          {
            tagStyle.icon && <Icon
              size={this.props.iconSize ? this.props.iconSize : tagStyle.iconSize}
              name={this.state.tagStyle.icon}
              style={[styles.icon, { color: tagStyle.iconColor }]}
            />
          }
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.text, { fontSize: this.props.valueSize, color: tagStyle.valueColor }]}
          >
            {this.props.value}
          </Text>
        </View>
      </SalonTouchableHighlight>
    );
  }
}

export default SalonBtnTag;
