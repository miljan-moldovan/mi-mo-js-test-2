import React from 'react';
import { View, TouchableOpacity, ListView, Text } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

import SalonIcon from '../../UI/Icon';
import NewCard from './newCalendar/newCard';

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
    paddingHorizontal: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#c7c7ce',
  },
  listView: {
    height: 56,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12,
    color: '#4D5067',
  },
};
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class calendarBuffer extends React.Component {
  renderCard = (item, key) => {
    return (
      <NewCard
        key={item.id}
        appointment={item}
        cardWidth={85}
        height={46}
        left={0}
        top={0}
        onDrop={() => {}}
        onLongPress={this.props.onCardLongPress}
      />
    )
  }

  renderSeparator = () => (<View style={{width: 4, opacity: 0}}/>)

  render() {
    const dataSource = ds.cloneWithRows(this.props.dataSource);
    return (
      <View style={styles.container} pointerEvents="box-none">
        <SlidingUpPanel
          visible={this.props.visible}
          onRequestClose={() => this.props.manageBuffer(false)}
          showBackdrop={false}
          height={110}
          onDragEnd={this.handleDragEnd}
        >
          <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row', justifyContent:'center',alignItems: 'center'}}>
              <Text style={styles.title}>MOVE APPOINTMENT</Text>
              <TouchableOpacity
                onPress={() => this.props.manageBuffer(false)}
              >
                <SalonIcon
                  color="#C0C1C6"
                  size={16}
                  type="regular"
                  name="timesCircle"
                  style={{ padding: 15 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
              <ListView
                contentContainerStyle={styles.listView}
                style={{ flex: 1 }}
                horizontal
                dataSource={dataSource}
                renderRow={this.renderCard}
                renderSeparator={this.renderSeparator}
              />
            </View>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}
