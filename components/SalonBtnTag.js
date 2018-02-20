import React from 'react';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonIcon from './../components/SalonIcon';

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
    width: 10,
    height: 13,
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

      <TouchableHighlight
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
          <SalonIcon
            size={this.props.iconSize}
            icon={this.state.tagStyle.icon}
            style={[styles.icon, { tintColor: this.state.tagStyle.iconColor }]}
          />
    }

          <Text style={[styles.text, {
          fontSize: this.props.valueSize,
          color: this.state.tagStyle.valueColor,
        }]}
          >{this.props.value}
          </Text>
        </View>
      </TouchableHighlight>
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
  activeStyle: PropTypes.object,
  inactiveStyle: PropTypes.object,
};

salonBtnTag.defaultProps = {
  valueSize: 14,
  tagHeight: 24,
  iconSize: 14,
  activeStyle: {
    icon: 'check',
    iconColor: '#FFFFFF',
    backgroundColor: '#1DBF12',
    valueColor: '#FFFFFF',
  },
  inactiveStyle: {
    icon: 'unchecked',
    iconColor: '#727A8F',
    backgroundColor: '#FFFFFF',
    valueColor: '#727A8F',
  },
  onPress: () => {},
};

export default salonBtnTag;
