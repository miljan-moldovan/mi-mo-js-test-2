import * as React from 'react';
import { Icons } from 'react-native-fontawesome';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import styles from './styles';
import { Text, View } from 'react-native';

type IProps = {
  text: string,
};

const maxLength = 140;

const ShowButton = (props) => {
  return (
    <View style={styles.buttonShowView}>
      <SalonTouchableOpacity
        style={styles.panelInfoShowMore}
        onPress={props.onPressShowMore}
      >
        <Text style={styles.panelInfoShowMoreText}>
          {props.title}
        </Text>
      </SalonTouchableOpacity>
    </View>
  );
};


class ShowMoreText extends React.Component<IProps> {
  state = {
    showMore: true,
    text: this.props.text.length > maxLength ? this.props.text.substring(0, maxLength) : this.props.text,
  };

  componentWillReceiveProps(newProps) {
    if (this.props.text !== newProps.text) {
      this.setState(
        {
          text: newProps.text.length > maxLength ? newProps.text.substring(0, maxLength) : newProps.text,
        },
      );
    }
  }

  onPressShowMore = () => {
    return this.setState({
      showMore: false,
      text: this.props.text,
    });
  };
  onPressShowLess = () => {
    return this.setState({
      showMore: true,
      text: this.props.text.substring(0, maxLength),
    });
  };

  render() {
    return (
      (

        <View style={styles.panelTopLine}>
          <View style={styles.panelTopLineLeft}>
            <View style={{ justifyContent: 'flex-start', width: '100%' }}>
              <Text
                style={styles.panelTopRemarks}
              >
                {this.state.text}
              </Text>
            </View>
            {this.props.text.length > maxLength &&
            (
              this.state.showMore ?
                <ShowButton onPressShowMore={this.onPressShowMore} title="SHOW MORE" /> :
                <ShowButton onPressShowMore={this.onPressShowLess} title="SHOW LESS" />
            )
            }
          </View>
        </View>

      )
    );
  }
}

export default ShowMoreText;
