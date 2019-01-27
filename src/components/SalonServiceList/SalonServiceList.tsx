import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Services } from '../../utilities/apiWrapper';

import SalonTouchableOpacity from '../SalonTouchableOpacity';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  inputRow: {
    alignSelf: 'stretch',
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto-Regular',
    alignItems: 'flex-start',
  },
  separator: {
    height: 1,
    backgroundColor: '#C0C1C6',
  },
});

export default class SalonServiceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
    };
  }

  componentWillMount() {
    Services.getServiceTree()
      .then((services) => {
        this.setState({ services });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  handlePress = (item) => {
    alert(item);
  }

  renderItem = (item) => {
    <SalonTouchableOpacity key={item.id} style={styles.inputRow} onPress={() => this.handlePress(item)}>
      <Text style={styles.textStyle}>{item.name}</Text>
      {item.services && item.services.length > 0 && (
        <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
      )}
    </SalonTouchableOpacity>;
  }

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.services}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
