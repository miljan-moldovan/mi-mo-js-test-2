import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingTop: 18,
  },
  titleRow: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
  },
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
    marginLeft: 10,
  },
  rowRightContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#727A8F',
    marginRight: 8,
  },
  label: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 12,
  },
  textData: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
  },
  checkIcon: {
    color: '#1DBF12',
    fontSize: 14,
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
    paddingRight: 16,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  textInput: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
    marginBottom: 9,
    height: 44,
  },
});

class WalkOutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonSelected: 0,
      otherText: '',
      provider: null,
    };
  }

  handlePressReason = (id) => {
    this.setState({ reasonSelected: id });
  }

  renderCheck = (reason) => {
    if (reason === this.state.reasonSelected) {
      return (
        <View style={styles.rowRightContainer}>
          <FontAwesome style={styles.checkIcon}>{Icons.checkCircle}</FontAwesome>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <View style={[styles.row, styles.borderTop]}>
            <Text style={styles.label}>Provider</Text>
            <View style={styles.rowRightContainer}>
              <View style={styles.imageContainer} />
              <Text style={styles.textData}>Rebecca Knowles</Text>
              <FontAwesome style={styles.carretIcon}>{Icons.angleRight}</FontAwesome>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>WALK-OUT REASON</Text>
        </View>
        <TouchableOpacity onPress={() => this.handlePressReason(1)}>
          <View style={[styles.row, styles.borderTop]}>
            <Text>Waited too much</Text>
            {this.renderCheck(1)}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePressReason(2)}>
          <View style={styles.row}>
            <Text>Personal Affairs</Text>
            {this.renderCheck(2)}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePressReason(3)}>
          <View style={styles.row}>
            <Text>Provider didn&#39;t show up</Text>
            {this.renderCheck(3)}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePressReason(4)}>
          <View style={styles.textAreaContainer}>
            <View style={styles.innerRow}>
              <Text>Other</Text>
              {this.renderCheck(4)}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Please specify"
              placeholderTextColor="#C0C1C6"
              multiline
              editable={this.state.reasonSelected === 4}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default WalkOutScreen;
