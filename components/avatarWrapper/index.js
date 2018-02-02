import React from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';


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
    width: '100%',
  },
});

export default class AvatarWrapper extends React.Component {
  constructor(props) {
    super(props);
    let image = 'image' in this.props ? this.props.image : this.state.image;
    if (typeof image === 'string' && image.startsWith('https:')) {
      image = { uri: image };
    }
    this.state.image = image;

    this.imageStyle = 'imageStyle' in this.props ? this.props.imageStyle : styles.imageStyle;

    this.borderColor = 'borderColor' in this.props ? this.props.borderColor : this.state.borderColor;
    this.borderWidth = 'borderWidth' in this.props ? this.props.borderWidth : this.state.borderWidth;

    this.wrapperStyle = 'wrapperStyle' in this.props ? this.props.wrapperStyle : styles.wrapperStyle;

    this.state.width = 'width' in this.props ? this.props.width : this.state.width;
    this.state.totalWidth = this.state.width;
    this.state.width = this.state.width - this.state.borderWidth;

    this.state.borderRadius = this.state.width / 2;
  }

  state = {
    image: null,
    width: 26,
    totalWidth: 26,
    borderRadius: 13,
    borderColor: 'transparent',
    borderWidth: 0,
  }

  componentWillReceiveProps(nextProps) {
    let image = 'image' in nextProps ? nextProps.image : this.state.image;
    if (typeof image === 'string' && image.startsWith('https:')) {
      image = { uri: image };
    }

    let width = 'width' in nextProps ? nextProps.width : this.state.width;
    width -= nextProps.borderWidth;

    const borderRadius = width / 2;

    this.setState({
      image,
      borderRadius,
      width,
      borderColor: nextProps.borderColor,
      borderWidth: nextProps.borderWidth,
    });
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    return (
      <View style={[styles.wrapperStyle, this.wrapperStyle]}>
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: this.state.totalWidth,
            height: this.state.totalWidth,
            borderRadius: this.state.totalWidth / 2,
            borderWidth: this.state.borderWidth,
            borderColor: this.state.borderColor,
          }}
        >
          <Image
            style={{
              width: this.state.width,
              height: this.state.width,
              borderRadius: this.state.width / 2,
            }}
            source={this.state.image}
          />
        </View>
      </View>
    );
  }
}
