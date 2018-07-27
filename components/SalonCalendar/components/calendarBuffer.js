import React from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

import SalonIcon from '../../UI/Icon';
import NewCard from './newCalendar/newCard';
import Card from './newCalendar/card';

const styles = {
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#3C4A5A',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  container: {
    position: 'absolute',
    height: 110,
    backgroundColor: 'transparent',
    width: '100%',
    bottom: 0,
    zIndex: 1,
  },
  listContainer: {
    margin: 8,
    marginTop: 0,
    flexDirection: 'row',
    backgroundColor: '#D8D8D8',
    borderRadius: 4,
    paddingHorizontal: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#c7c7ce',
  },
  listView: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12,
    color: '#4D5067',
    paddingBottom: 10,
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgb(204, 204, 204)',
  },
  titleContainers: {
    alignItems: 'center',
    flex: 1,
    paddingLeft: 46,
  },
};

export default class calendarBuffer extends React.Component {
  constructor(props) {
    super();
    this.state = { bufferPosition: props.screenHeight };
  }

  handleDragEnd = (position) => {
    const { screenHeight } = this.props;
    const boundLength = 20;
    const diff = this.state.bufferPosition - position;
    const hidePosition = screenHeight - 75;
    if (diff > boundLength) {
      this.state.bufferPosition = hidePosition;
      this.slider.transitionTo({
        toValue: hidePosition,
      });
    } else if (diff < -boundLength) {
      this.state.bufferPosition = screenHeight;
      this.slider.transitionTo({
        toValue: screenHeight,
        onAnimationEnd: () => this.props.setBufferCollapsed(false)
      });
    } else {
      this.slider.transitionTo({
        toValue: this.state.bufferPosition,
        onAnimationEnd: () => this.props.setBufferCollapsed(true)
      });
    }
  }

  manageBuffer = () => {
    const { bufferPosition } = this.state;
    const { screenHeight } = this.props;
    const hidePosition = screenHeight - 75;
    if (bufferPosition === hidePosition) {
      this.state.bufferPosition = screenHeight;
      this.slider.transitionTo({
        toValue: screenHeight,
        onAnimationEnd: () => this.props.setBufferCollapsed(false)
      });
    } else {
      this.state.bufferPosition = hidePosition;
      this.slider.transitionTo({
        toValue: hidePosition,
        onAnimationEnd: () => this.props.setBufferCollapsed(true)
      });
    }
  }

  renderCard = ({ item }) => {
    const { panResponder, activeCard } = this.props;
    const isActive = activeCard && activeCard.appointment.id === item.id;
    const hasPanResponder = !activeCard || isActive ? panResponder : null;
    return (
      <Card
        isBufferCard
        isActive={isActive}
        panResponder={hasPanResponder}
        key={item.id}
        appointment={item}
        cardWidth={85}
        height={46}
        left={0}
        top={0}
        onDrop={() => {}}
        onDrag={this.props.onCardLongPress}
      />
    );
    // return (
    //   <NewCard
    //     panResponder={hasPanResponder}
    //     key={item.id}
    //     appointment={item}
    //     cardWidth={85}
    //     height={46}
    //     left={0}
    //     top={0}
    //     onDrop={() => {}}
    //     onLongPress={this.props.onCardLongPress}
    //   />
    // );
}

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <SlidingUpPanel
          visible={this.props.visible}
          showBackdrop={false}
          height={110}
          onDragEnd={this.handleDragEnd}
          ref={(view) => { this.slider = view; }}
          allowMomentum={false}
        >
          <View style={styles.cardContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.titleContainers}>
                <TouchableOpacity onPress={this.manageBuffer} style={{paddingVertical: 10}}>
                  <View style={styles.dragHandle} />
                </TouchableOpacity>
                <Text style={styles.title}>MOVE APPOINTMENT</Text>
              </View>
              <TouchableOpacity
                onPress={this.props.closeBuffer}
              >
                <SalonIcon
                  color="#C0C1C6"
                  size={16}
                  type="solid"
                  name="timesCircle"
                  style={{ padding: 15 }}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.listContainer]}>
              <View style={[{ flexDirection: 'row' }, styles.listView]}>
                {this.props.dataSource.map((appt, index) => this.renderCard({ item: appt }))}
              </View>
            </View>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}
