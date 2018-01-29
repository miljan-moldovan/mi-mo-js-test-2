import React, {Component} from 'react';
import {
  View, Text, Image, StyleSheet
} from 'react-native';

export default class ImageWrapper extends Component {

  state = {
    image: '',
    hidden: false
  }

  constructor(props){
    super(props);
    this.state.image = 'image' in this.props ?  this.props.image : this.state.image
    if(typeof this.state.image == 'string' && this.state.image.startsWith("https:")){
      this.state.image = {uri: this.state.image}
    }
    this.imageStyle = 'imageStyle' in this.props ?  this.props.imageStyle : styles.imageStyle
  }

  componentWillReceiveProps(nextProps){

    let image = 'image' in nextProps ?  nextProps.image : this.state.image
    if(typeof image == 'string' && image.startsWith("https:")){
      image = {uri: image}
    }

    this.setState({image: image});
  }

  render(){
    return (
      <View style={styles.wrapperStyle}>
          <Image
          style={this.imageStyle}
          source={this.state.image}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    flex:1,
    width: '100%',
    height: '100%'
  },
  wrapperStyle:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    flex:1,
  }
});
