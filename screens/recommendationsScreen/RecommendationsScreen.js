import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';

import SalonCard from '../../components/SalonCard';
import Icon from '../../components/UI/Icon';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import { SectionTitle } from '../../components/formHelpers';
import SalonActionSheet from '../../components/SalonActionSheet';


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
    marginBottom: 5,
  },
  addButtonText: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,

  },
  serviceCategoryTitle: {
    fontFamily: 'Roboto',
    color: '#0C4699',
    fontSize: 12,
  },
  serviceTitle: {
    fontFamily: 'Roboto',
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
    marginRight: 5,
  },
  employeeText: {
    fontFamily: 'Roboto',
    color: '#2F3142',
    fontSize: 11,
    marginRight: 5,
  },
  dateText: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 10,
  },
  firstItemContainer: {
    height: 72,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    backgroundColor: 'rgba(195,214,242,0.5)',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  firstItemTitle: {
    marginLeft: 19,
    color: '#110A24',
    fontSize: 16,
    fontWeight: '700',
  },
  firstItemSubTitle: {
    marginLeft: 19, width: '90%', color: '#110A24', fontSize: 16, fontWeight: '500',
  },
  secondItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    height: 55,
    width: '90%',
  },
  secondItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 4,
  },
  secondItemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  secondItemTitle: { fontSize: 21, fontWeight: '500' },
  cancelTitle: { fontSize: 20, color: '#0C4699' },
});


const CANCEL_INDEX = 3;
const DESTRUCTIVE_INDEX = 1;
const options = [
  <View style={styles.firstItemContainer}>
    <Text style={styles.firstItemTitle}>Lash Application
    </Text>
    <Text style={styles.firstItemSubTitle}>Ashley Soto
    </Text>
  </View>,

  <View style={styles.secondItemContainer}>
    <View style={styles.secondItemLeft}>
      <Text style={[styles.secondItemTitle, { color: '#115ECD' }]}>Add to transaction</Text>
    </View>
    <View style={styles.secondItemRight}>
      <Icon
        name="plusCircle"
        type="regular"
        color="#115ECD"
        size={16}
      />
    </View>
  </View>,


  <View style={styles.secondItemContainer}>
    <View style={styles.secondItemLeft}>
      <Text style={[styles.secondItemTitle, { color: '#D1242A' }]}>Remove recommendation</Text>
    </View>
    <View style={styles.secondItemRight}>
      <Icon
        name="trashAlt"
        type="regular"
        color="#D1242A"
        size={16}
      />
    </View>
  </View>,
  <Text style={styles.cancelTitle}>Cancel
  </Text>,
];

const ProductCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0, height: 73 }}
    bodyStyles={{ paddingVertical: 10 }}
    bodyChildren={[
      <View key={Math.random()} style={{ flex: 1, alignSelf: 'flex-start' }}>
        <View>
          <Text style={styles.serviceCategoryTitle}>Dry Shampoo</Text>
          <Text style={styles.serviceTitle}>Dynamo Humm</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={styles.employeeText}>Evelyn Young</Text>
          <Text style={styles.dateText}>Dec.11 2017</Text>
        </View>
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
          <SalonTouchableOpacity onPress={props.showActionSheet}>
            <Icon name="ellipsisH" size={21} color="#115ECD" type="solid" />
          </SalonTouchableOpacity>
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
    marginRight: 5,
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
  <SalonTouchableOpacity
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
  </SalonTouchableOpacity>
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
  <SalonTouchableOpacity
    onPress={() => { rootProps.navigation.goBack(); }}
    style={{ marginLeft: 10 }}
  >
    <Icon
      name="angleLeft"
      type="regular"
      color="white"
      size={24}
    />
  </SalonTouchableOpacity>,

  });

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  showActionSheet = () => {
    this.SalonActionSheet.show();
  };

  handlePress = (i) => {
    setTimeout(() => {
      this.handlePressAction(i);
    }, 500);
    return false;
  }

  handlePressAction(i) {
    switch (i) {
      case 0:
        // this.editNote(this.state.note);
        break;
      case 1:
        // this.deleteNoteAlert(this.state.note);
        break;
      default:
        break;
    }

    return false;
  }

  render() {
    return (
      <View style={styles.container}>
        <SalonActionSheet
          ref={o => this.SalonActionSheet = o}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(i) => { this.handlePress(i); }}
          wrapperStyle={{ paddingBottom: 11 }}
          optionStyles={[{ height: 72 }, { height: 56.5 }, { height: 56.5 }, { height: 56, marginTop: 8 }]}
        />

        <View style={{ marginTop: 12, marginHorizontal: 10 }}>
          <SectionTitle
            value="Products"
            case="ignore"
            style={{ height: 35 }}
            sectionTitleStyle={{
              fontSize: 14,
              marginLeft: 6,
              lineHeight: 22,
              color: '#4D5067',
              fontFamily: 'Roboto',
              fontWeight: '700',
            }}
          />
          <ProductCard showActionSheet={this.showActionSheet} />
          <AddButton title="Add product recommendation" onPress={() => alert('add')} />
        </View>
      </View>
    );
  }
}
