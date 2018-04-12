import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';

import SalonCard from '../../components/SalonCard';
import Icon from '../../components/UI/Icon';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

const ProductCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0 }}
    bodyStyles={{ paddingVertical: 10 }}
    bodyChildren={[
      <View key={Math.random()} style={{ flex: 1, alignSelf: 'flex-start' }}>
        <Text style={styles.serviceTitle}>Dry Shampoo</Text>
        <Text style={styles.employeeText}>Dynamo Humm</Text>
      </View>,
      <View
        key={Math.random()}
        style={{
        flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-end', flexDirection: 'row',
        }}
      >
        <View>
          <Text style={styles.price}>$15</Text>
        </View>
        <View>
          <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
        </View>
      </View>,
    ]}
  />
);

const CircularIcon = props => (
  <View style={{
    height: props.size,
    width: props.size,
    borderRadius: props.size / 2,
    backgroundColor: props.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  }}
  >
    <FontAwesome style={{
      color: props.color,
      fontSize: props.iconSize,
    }}
    >
      {Icons[props.icon]}
    </FontAwesome>
  </View>
);
CircularIcon.propTypes = {
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  iconSize: PropTypes.number,
  icon: PropTypes.string,
};
CircularIcon.defaultProps = {
  size: 22,
  backgroundColor: '#115ECD',
  color: 'white',
  iconSize: 16,
  icon: 'plus',
};

const AddButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 12,
    }}
  >
    <CircularIcon />
    <Text style={styles.addButtonText}> {props.title}</Text>
  </TouchableOpacity>
);
AddButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default class RecommendationsScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'Recommendations',
  });

  static navigationOptions = rootProps => ({
    headerTitle: <Text style={styles.titleText}>Recommended</Text>,
    headerLeft:
  <TouchableOpacity
    onPress={() => { rootProps.navigation.goBack(); }}
  >
    <Icon
      name="angleLeft"
      type="regular"
      color="white"
      size={19}
    />
  </TouchableOpacity>,

  });

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 16, marginHorizontal: 10 }}>
          <Text>Services</Text>
          <ProductCard />
          <AddButton title="Add product recommendation" onPress={() => alert('add')} />
          <Text>Products</Text>
          <ProductCard />
        </View>
      </View>
    );
  }
}
