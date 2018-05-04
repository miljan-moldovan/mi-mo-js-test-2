import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from './../components/UI/Icon';
import SalonTouchableHighlight from './../components/SalonTouchableHighlight';

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

class salonBtnTag extends React.Component {
  constructor(props) {
    super(props);
    const tagStyle = props.isVisible ? props.activeStyle : props.inactiveStyle;
    this.state = { tagStyle };
  }

  state = {
    tagStyle: {},
  }

  componentWillReceiveProps(nextProps) {
    const tagStyle = nextProps.isVisible ? nextProps.activeStyle : nextProps.inactiveStyle;
    this.setState = { tagStyle };
  }

  render() {
    const onPress = this.props.onPress ?
      this.props.onPress : null;

    return (

      <SalonTouchableHighlight
        onPress={() => onPress(this.props.value)}
        underlayColor="transparent"
        style={styles.btnContainer}
      >
        <View style={[styles.container, {
    backgroundColor: this.state.tagStyle.backgroundColor,
    height: this.props.tagHeight,
  }]}
        >
          {this.state.tagStyle.icon &&
          <Icon
            size={this.props.iconSize ? this.props.iconSize : this.state.tagStyle.iconSize}
            name={this.state.tagStyle.icon}
            style={[styles.icon, { color: this.state.tagStyle.iconColor }]}
          />
    }

          <Text style={[styles.text, {
          fontSize: this.props.valueSize,
          color: this.state.tagStyle.valueColor,
        }]}
          >{this.props.value}
          </Text>
        </View>
      </SalonTouchableHighlight>
    );
  }
}

salonBtnTag.propTypes = {
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

salonBtnTag.defaultProps = {
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

export default salonBtnTag;
