import * as React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputRadioGroup,
  InputGroup,
  SectionDivider,
  SectionTitle,
} from '../../components/formHelpers';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';


class BlockTimesReasonsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <SalonHeader
        title="Reason"
        headerLeft={
          <SalonTouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 14, color: 'white' }}>Back</Text>
          </SalonTouchableOpacity>
        }
      />
    ),
  })

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ handleDone: this.handleDone });
    const { selectedBlockTimesReason } = this.props.navigation.state.params;


    this.state.type = selectedBlockTimesReason;

    props.blockTimesReasonsActions.getBlockTimesReasons(this.finishedBlockTimesReasons);
  }

  state = {
    type: null,
  }


  finishedBlockTimesReasons = (result) => {

  }


  handleDone = () => {

  }

  handleOnChangeBlockTimesReason = (option) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }

    this.setState({ type: option });

    const { onChangeBlockTimesReason, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeBlockTimesReason) { onChangeBlockTimesReason(option); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.blockTimesReasonsState.isLoading
          ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : (
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
              <SectionDivider style={{ height: 20 }} />
              <InputGroup>
                <InputRadioGroup
                  options={this.props.blockTimesReasonsState.blockTimesReasons}
                  defaultOption={this.state.type}
                  onPress={this.handleOnChangeBlockTimesReason}
                />
              </InputGroup>
              <SectionTitle value="Please select a reason for blocking time" style={styles.sectionTitle} />
            </KeyboardAwareScrollView>)}
      </View>
    );
  }
}


BlockTimesReasonsScreen.defaultProps = {

};

BlockTimesReasonsScreen.propTypes = {
  blockTimesReasonsActions: PropTypes.shape({
    getBlockTimesReasons: PropTypes.func.isRequired,
  }).isRequired,
  blockTimesReasonsState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default BlockTimesReasonsScreen;
