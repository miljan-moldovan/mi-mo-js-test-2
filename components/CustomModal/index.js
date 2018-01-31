import React, { Component } from "react"
import { Text, TouchableHighlight, View } from "react-native"
import Modal from "react-native-modal"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: null,
    }
  }

  componentWillMount() {
    this.setState({isVisible: this.props.isVisible});
  }

  render() {
    return (
        <Modal
          style={{...this.props.style , ...styles.container}}
          isVisible={this.state.isVisible}
          onBackdropPress={this.props.closeModal ? this.props.closeModal : null}
          {...this.props}
        >
          <View style={styles.content}>
            { this.props.children }
          </View>
        </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  content: {
    backgroundColor: 'white',
    alignSelf: "stretch",
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottom: {
    borderTopWidth: 0.5,
    borderTopColor: "#95989A",
    alignSelf: 'flex-end',
    alignItems: "center",
    marginTop: 20,
    width: '100%'
  },
  subtitle: {
    fontSize: 17,
    color: "#4D90FE",
    textAlign: "center",
    marginBottom: 15
  },
  iconClose:{
    color:"#4D90FE",
    fontSize: 30,
    fontWeight: 'bold'
  },
  closeButton:{
    position: "absolute",
    width: 30,
    height: 30,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    top: 10,
    right: 10,
  }
}
