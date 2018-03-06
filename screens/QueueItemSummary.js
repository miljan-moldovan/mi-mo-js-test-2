import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ListItem from './QueueListItemSummary';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
  },
  header: {
    backgroundColor: '#115ECD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
  nameText: {
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  infoIcon: {
    color: '#115ECD',
    fontSize: 20,
  },
  clockIcon: {
    fontSize: 12,
    color: '#c8c8c8',
    marginRight: 5,
  },
  angleIcon: {
    fontSize: 12,
    marginHorizontal: 5,
    color: '#111415',
  },
  timeText: {
    fontSize: 11,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  remTimeText: {
    fontSize: 10,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: 10,
    maxHeight: 180,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnBottom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#727A8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    color: '#fff',
    fontSize: 26,
  },
  btnbottomText: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#727A8F',
  },
  btnGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class QueueItemSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      translateYAnim: new Animated.Value(360),
      isVisible: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.isVisible && newProps.isVisible) {
      this.setState({ isVisible: newProps.isVisible });
      Animated.sequence([this.fadeInOut(1), this.translateY(0)]).start();
    } else if (this.props.isVisible && !newProps.isVisible) {
      Animated.sequence([this.translateY(360),
        this.fadeInOut(0)]).start(() => this.setState({ isVisible: newProps.isVisible }));
    }
  }

  fadeInOut = value => Animated.timing( // Animate over time
    this.state.fadeAnim, // The animated value to drive
    {
      toValue: value, // Animate to opacity: 1 (opaque)
      duration: 100, // Make it take a while
    },
  ); // Starts the animation

  translateY = value => Animated.timing( // Animate over time
    this.state.translateYAnim, // The animated value to drive
    {
      toValue: value, // Animate to opacity: 1 (opaque)
      duration: 300, // Make it take a while
    },
  ); // Starts the animation

  keyExtractor = (item, index) => index;

  renderItem =({ item }) => (
    <ListItem service={item} />
  )

  render() {
    const { fadeAnim, translateYAnim } = this.state;
    if (this.state.isVisible) {
      return (
        <Animated.View style={[
          styles.container,
          { opacity: fadeAnim },
        ]}
        >
          <Animated.View style={[
            styles.content,
            {
              transform: [{
                translateY: translateYAnim,
              }],
            },
          ]}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={this.props.onDonePress}>
                <Text style={styles.btnText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.nameText}>{`${this.props.client.name} ${this.props.client.lastName}`}</Text>
                <View style={styles.dataContainer}>
                  <FontAwesome style={styles.infoIcon}>{Icons.infoCircle}</FontAwesome>
                </View>
              </View>
              <View style={styles.row}>
                <FontAwesome style={styles.clockIcon}>{Icons.clockO}</FontAwesome>
                <Text style={styles.timeText}>11:57 AM</Text>
                <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
                <Text style={styles.remTimeText}>{'REM wait '}
                  <Text style={styles.underlineText}>7m</Text>
                </Text>
              </View>
              <ScrollView style={styles.listContainer}>
                <FlatList
                  data={this.props.services}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                />
              </ScrollView>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={this.props.onPressSummary.checkIn}>
                  <View style={styles.btnGroup}>
                    <View style={styles.btnBottom}>
                      <FontAwesome style={styles.btnIcon}>{Icons.check}</FontAwesome>
                    </View>
                    <Text style={styles.btnbottomText}>Check-in</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onPressSummary.walkOut}>
                  <View style={styles.btnGroup}>
                    <View style={styles.btnBottom}>
                      <FontAwesome style={styles.btnIcon}>{Icons.signOut}</FontAwesome>
                    </View>
                    <Text style={styles.btnbottomText}>Walk-out</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onPressSummary.modify}>
                  <View style={styles.btnGroup}>
                    <View style={styles.btnBottom}>
                      <FontAwesome style={styles.btnIcon}>{Icons.pencil}</FontAwesome>
                    </View>
                    <Text style={styles.btnbottomText}>Modify</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onPressSummary.returning}>
                  <View style={styles.btnGroup}>
                    <View style={styles.btnBottom}>
                      <FontAwesome style={styles.btnIcon}>{Icons.refresh}</FontAwesome>
                    </View>
                    <Text style={styles.btnbottomText}>Returning</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onPressSummary.toService}>
                  <View style={styles.btnGroup}>
                    <View style={styles.btnBottom}>
                      <FontAwesome style={styles.btnIcon}>{Icons.play}</FontAwesome>
                    </View>
                    <Text style={styles.btnbottomText}>To Service</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      );
    }
    return null;
  }
}

export default QueueItemSummary;
