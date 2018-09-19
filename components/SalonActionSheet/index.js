import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text, View, StyleSheet, Dimensions,
  Modal, Animated, ScrollView,
} from 'react-native';

import styles, { btnStyle, sheetStyle, hairlineWidth } from './styles';
import SalonTouchableHighlight from '../SalonTouchableHighlight';


const TITLE_H = 40;
const MESSAGE_H = 40;
const CANCEL_MARGIN = 6;
const BUTTON_H 				= 55 + hairlineWidth;
const WARN_COLOR 			= '#ff3b30';
const MAX_HEIGHT 			= Dimensions.get('window').height * 0.7;


class SalonActionSheet extends Component {
  constructor(props) {
    super(props);
    this.scrollEnabled = false;
    const translateY = this._calculateHeight(props);
    this.state = {
      translateY,
      visible: false,
      sheetAnim: new Animated.Value(translateY),
    };
    this._cancel = this._cancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      translateY: this._calculateHeight(nextProps),
    });
  }

  show() {
    this.setState({ visible: true });
    this._showSheet();
  }

  hide(index) {
    this._hideSheet(() => {
      this.setState({ visible: false });
      this.props.onPress(index);
    });
  }

  _cancel() {
    const { cancelButtonIndex } = this.props;
    // 保持和 ActionSheetIOS 一致，
    // 未设置 cancelButtonIndex 时，点击背景不隐藏 ActionSheet
    if (cancelButtonIndex > -1) {
      this.hide(cancelButtonIndex);
    }
  }

  _showSheet() {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
    }).start();
  }

  _hideSheet(callback) {
    const { translateY } = this.state;
    Animated.timing(this.state.sheetAnim, {
      toValue: translateY,
      duration: 150,
    }).start(callback || (() => {}));
  }

  _calculateHeight(props) {
    let count = props.options.length;
    let height = props.optionStyles && props.optionStyles.length > 0
    && props.cancelButtonIndex < props.optionStyles.length ? props.optionStyles[props.cancelButtonIndex].marginTop : CANCEL_MARGIN;


    if (props.optionStyles) {
      for (let i = 0; i < props.optionStyles.length; i++) {
        const style = props.optionStyles[i];
        if (style && 'height' in style) {
          count -= 1;
          height += style.height;
        }
      }
    }

    height += BUTTON_H * count;

    if (props.title) height += TITLE_H;
    if (props.message) height += MESSAGE_H;
    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true;
      return MAX_HEIGHT;
    }
    this.scrollEnabled = false;
    return height;
  }

  _renderTitle() {
    const { title } = this.props;

    if (!title) {
      return null;
    }

    if (React.isValidElement(title)) {
      return (
        <View style={sheetStyle.title}>{title}</View>
      );
    }

    return (
      <View style={sheetStyle.title}>
        <Text style={sheetStyle.titleText}>{title}</Text>
      </View>
    );
  }

  _renderMessage() {
    const { message } = this.props;

    if (!message) {
      return null;
    }

    if (React.isValidElement(message)) {
      return (
        <View style={sheetStyle.message}>{message}</View>
      );
    }

    return (
      <View style={sheetStyle.message}>
        <Text style={sheetStyle.titleText}>{message}</Text>
      </View>
    );
  }

  _renderCancelButton() {
    const {
      options, cancelButtonIndex, tintColor, optionStyles,
    } = this.props;
    if (cancelButtonIndex > -1 && options[cancelButtonIndex]) {
      const wrapperStyle = optionStyles && optionStyles.length > 0
      && cancelButtonIndex < optionStyles.length ? optionStyles[cancelButtonIndex] : {};

      return (
        <SalonTouchableHighlight
          activeOpacity={1}
          underlayColor="#f4f4f4"
          style={[btnStyle.wrapper, { marginTop: 6, borderRadius: 10 }, wrapperStyle]}
          onPress={this._cancel}
        >
          <Text style={[btnStyle.title, { fontWeight: '700', color: tintColor }]}>{options[cancelButtonIndex]}</Text>
        </SalonTouchableHighlight>
      );
    }
    return null;
  }

  _createButton(title, fontColor, index, style) {
    const { options } = this.props;
    let borderRadiusStyle = {};
    if (index === 0) {
      borderRadiusStyle = { borderTopLeftRadius: 10, borderTopRightRadius: 10 };
    } else if (index === options.length - 2) {
      borderRadiusStyle = { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 };
    }

    let titleNode = null;
    if (React.isValidElement(title)) {
      titleNode = title;
    } else {
      titleNode = <Text style={[btnStyle.title, { color: fontColor }]}>{title}</Text>;
    }
    return (
      <SalonTouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor="#f4f4f4"
        style={[btnStyle.wrapper, style || {}, borderRadiusStyle]}
        onPress={this.hide.bind(this, index)}
      >
        {titleNode}
      </SalonTouchableHighlight>
    );
  }

  _renderOptions() {
    const {
      options, tintColor, cancelButtonIndex, destructiveButtonIndex, optionStyles,
    } = this.props;


    return options.map((title, index) => {
      const wrapperStyle = optionStyles && optionStyles.length > 0
      && index < optionStyles.length ? optionStyles[index] : null;

      const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor;
      return index === cancelButtonIndex ? null : this._createButton(title, fontColor, index, wrapperStyle);
    });
  }

  render() {
    const { cancelButtonIndex } = this.props;
    const { visible, sheetAnim, translateY } = this.state;
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={this._cancel}
      >
        <View style={[sheetStyle.wrapper, this.props.wrapperStyle]}>
          <Text style={styles.overlay} onPress={this._cancel} />
          <Animated.View
            style={[sheetStyle.bd, { height: translateY, transform: [{ translateY: sheetAnim }] }]}
          >
            {this._renderTitle()}
            {this._renderMessage()}
            <ScrollView
              scrollEnabled={this.scrollEnabled}
              contentContainerStyle={sheetStyle.options}
            >
              {this._renderOptions()}
            </ScrollView>
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}


SalonActionSheet.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  message: PropTypes.string,
  options: PropTypes.arrayOf((propVal, key, componentName, location, propFullName) => {
    if (typeof propVal[key] !== 'string' && !React.isValidElement(propVal[key])) {
      return new Error(`Invalid prop \`${propFullName}\` supplied to` +
        ` \`${componentName}\`. Validation failed.`);
    }
  }),
  tintColor: PropTypes.string,
  cancelButtonIndex: PropTypes.number,
  destructiveButtonIndex: PropTypes.number,
  onPress: PropTypes.func,
};


SalonActionSheet.defaultProps = {
  tintColor: '#007aff',
  onPress: () => {},
};


export default SalonActionSheet;
