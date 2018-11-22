import * as React from 'react';
import { View, Animated, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from '../../../components/UI/Icon';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../queueTimeNote';
import StatusEnum from '../../../constants/Status';
import QueueTypes from '../../../constants/QueueTypes';
import createStyleSheet from './styles';

import ClientInfoButton from '../../../components/ClientInfoButton';

interface Props {
  isVisible : boolean;
  onPressSummary: any;
  isWaiting: boolean;
  showDialog: any;
  onDonePress: any;
  appointment: any;
  item: any;
  services: any;
  navigation: any;
  client: any;
  hide: any;

}

interface State {
  fadeAnim?: any;
  translateYAnim: any;
  isVisible: boolean;
  styles?: any;
}


export default class QueueItemSummary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      translateYAnim: new Animated.Value(360),
      isVisible: false,
      styles: createStyleSheet()
    };
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.isVisible && newProps.isVisible) {
      this.setState({ isVisible: newProps.isVisible });
      this.translateY(0).start();
    } else if (this.props.isVisible && !newProps.isVisible) {
      this.translateY(360).start(() => this.setState({ isVisible: newProps.isVisible }));
    }
  }

onPressModify = () => {
  this.props.onPressSummary.modify(this.props.isWaiting, this.props.onPressSummary);
}

onPressReturn = returned => this.props.onPressSummary.returning(returned)

goToClientInfo = () => {
  this.props.onDonePress();
};

keyExtractor = (item, index) => index;

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

renderBtnContainer = () => {
  let isActiveCheckin = false;
  let isDisabledReturnLater;
  let returned;
  let isActiveWalkOut = true;
  let isActiveFinish;
  let isActiveWaiting = true;
  let isAppointment = true;
  let isActiveUnCheckin = false;
  let isDisabledStart = true;

  if (this.props.appointment) {
    returned = this.props.appointment.status === StatusEnum.returningLater;
    isActiveWalkOut = !(this.props.appointment.queueType === QueueTypes.PosAppointment &&
    !(this.props.appointment.status === StatusEnum.checkedIn));

    isAppointment = this.props.appointment.queueType === QueueTypes.PosAppointment;

    if (this.props.appointment.status === StatusEnum.notArrived) {
      isDisabledReturnLater = true;
      isActiveCheckin = true;
    }

    if (this.props.appointment.status === StatusEnum.checkedIn ||
      this.props.appointment.status === StatusEnum.notArrived ||
      this.props.appointment.status === StatusEnum.returningLater
    ) {
      isDisabledStart = false;
    }

    if (isAppointment && this.props.appointment.status === StatusEnum.checkedIn) {
      isActiveUnCheckin = true;
    }

    if (this.props.appointment.status === StatusEnum.inService) {
      isActiveWaiting = true;
      isActiveFinish = true;
    } else {
      isActiveWaiting = false;
      isActiveFinish = false;
    }
  }
  const otherBtnStyle = this.state.styles.btnBottom;

  let result;

  if (this.props.isWaiting) {
    result = 
      <View style={this.state.styles.btnContainer}>
        {isActiveUnCheckin ?
          <SalonTouchableOpacity
            onPress={() => this.props.onPressSummary.checkIn(isActiveCheckin)}
          >
            <View style={this.state.styles.btnGroup}>
              <View style={this.state.styles.btnBottom}>
                <Icon name="check" size={16} color="#fff" type="solid" />
              </View>
              <Text style={this.state.styles.btnbottomText}>Uncheck-in</Text>
            </View>
          </SalonTouchableOpacity>
          :
          <SalonTouchableOpacity
            onPress={() => this.props.onPressSummary.checkIn(isActiveCheckin)}
            disabled={!isActiveCheckin}
          >
            <View style={this.state.styles.btnGroup}>
              <View style={!isActiveCheckin ?
                  [this.state.styles.btnBottom, this.state.styles.btnDisabled] : this.state.styles.btnBottom}
              >
                <Icon name="check" size={16} color="#fff" type="solid" />
              </View>
              <Text style={this.state.styles.btnbottomText}>Check-in</Text>
            </View>
          </SalonTouchableOpacity>
        }
        <SalonTouchableOpacity
          onPress={() => this.props.onPressSummary.walkOut(isActiveWalkOut)}
        >
          <View style={this.state.styles.btnGroup}>
            <View style={this.state.styles.btnBottom}>
              <Icon name="signOut" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>{isActiveWalkOut ? 'Walk-out' : 'No Show'} </Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity onPress={this.onPressModify}>
          <View style={this.state.styles.btnGroup}>
            <View style={otherBtnStyle}>
              <Icon name="penAlt" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>Modify</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => { this.onPressReturn(returned); }}
          disabled={isDisabledReturnLater}
        >
          <View style={this.state.styles.btnGroup}>
            <View style={isDisabledReturnLater ?
              [this.state.styles.btnBottom, this.state.styles.btnDisabled] : this.state.styles.btnBottom}
            >
              <Icon name="history" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>{returned ? 'Returned' : 'Returning'}</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.toService}
          disabled={isDisabledStart}
        >
          <View style={this.state.styles.btnGroup}>

            <View style={isDisabledStart ?
              [this.state.styles.btnBottom, this.state.styles.btnDisabled] : this.state.styles.btnBottom}
            >
              <Icon name="play" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>To Service</Text>
          </View>
        </SalonTouchableOpacity>
      </View>
    
  }else{
    result = 
      <View style={this.state.styles.btnContainer}>
        


        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.toWaiting}
          disabled={!isActiveWaiting}
        >
          <View style={[this.state.styles, this.state.styles.btnGroup]}>
            <View style={isActiveWaiting ? this.state.styles.btnBottom : [this.state.styles.btnBottom, this.state.styles.btnDisabled]}>
              <Icon name="hourglassHalf" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>To Waiting</Text>
          </View>
        </SalonTouchableOpacity>


        <SalonTouchableOpacity onPress={this.props.onPressSummary.rebook}>
          <View style={this.state.styles.btnGroup}>
            <View style={this.state.styles.btnBottom}>
              <Icon name="undo" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>Rebook</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={this.onPressModify}
        >
          <View style={this.state.styles.btnGroup}>
            <View style={otherBtnStyle}>
              <Icon name="penAlt" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>Modify</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => this.props.onPressSummary.finish(isActiveFinish)}
        >
          <View style={this.state.styles.btnGroup}>
            <View style={this.state.styles.btnBottom}>
              <Icon name="checkSquare" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>{isActiveFinish ? 'Finish' : 'Undo finish'}</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity onPress={this.props.onPressSummary.checkOut}>
          <View style={this.state.styles.btnGroup}>
            <View style={this.state.styles.btnBottom}>
              <Icon name="dollar" size={16} color="#fff" type="solid" />
            </View>
            <Text style={this.state.styles.btnbottomText}>Checkout</Text>
          </View>
        </SalonTouchableOpacity>
      </View>
    
  }

  return result
  
}

renderItem =({ item }) => (
  //<ListItem {...this.props} service={item} />
  <View></View>
)

render() {
  const item = this.props.item ? this.props.item : {};
  const isBookedByWeb = item.queueType === QueueTypes.BookedbyWeb;

  const { translateYAnim } = this.state;

  if (this.state.isVisible) {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.state.isVisible}
      >
        <View style={ this.state.styles.container}>
          <TouchableWithoutFeedback onPress={this.props.hide}>
            <View style={this.state.styles.hideBtn} />
          </TouchableWithoutFeedback>
          <Animated.View style={[
              this.state.styles.content,
              {
                transform: [{
                  translateY: translateYAnim,
                }],
              },
            ]}
          >
            <View style={this.state.styles.header}>
              <SalonTouchableOpacity onPress={this.props.onDonePress}>
                <Text style={this.state.styles.btnText}>Done</Text>
              </SalonTouchableOpacity>
            </View>
            <View style={this.state.styles.body}>
              <View style={[this.state.styles.row, { minHeight: 20 }]}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={this.state.styles.nameText}>{`${this.props.client.name} ${this.props.client.lastName}`}</Text>
                <ClientInfoButton
                  client={this.props.client}
                  navigation={this.props.navigation}
                  onDonePress={this.goToClientInfo}
                  buttonStyle={this.state.styles.clientIcon}
                  iconStyle={{
                   fontSize: 20, color: '#115ECD', fontWeight: '100', fontFamily: 'FontAwesome5ProLight',
                  }}
                  apptBook={false}
                />
              </View>
              <QueueTimeNote type="long" item={item} />
              <ScrollView style={this.state.styles.listContainer}>
                <FlatList
                  data={this.props.services}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                />
              </ScrollView>
              {this.renderBtnContainer()}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
  return null;
}
}