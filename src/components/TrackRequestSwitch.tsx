import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, find } from 'lodash';
import { InputSwitch, InputDivider } from './formHelpers';
import settingsActions from '../redux/actions/settings';
import { SettingsActions } from '@/models/Settings';
import { SettingsReducer } from '@/redux/reducers/settings';

export interface TrackRequestSwitchProps {
  initialValue?: boolean;
  settingsActions: SettingsActions;
  settings: SettingsReducer;
  textStyle?: any;
  middleSectionDivider?: any;
  style?: any;
  isFirstAvailable?: boolean;
  hideDivider?: boolean;
  onChange: (newVal: boolean) => void;
}

export interface TrackRequestSwitchState {
  value: boolean;
  trackRequest: boolean;
}

class TrackRequestSwitch extends React.Component<TrackRequestSwitchProps, TrackRequestSwitchState> {
  constructor(props) {
    super(props);
    let value = false;
    if (props.initialValue) {
      value = props.initialValue;
    }
    this.state = {
      value,
      trackRequest: props.settings.data.TrackRequest || false,
    };
    this.props.settingsActions.getSettingsByName('TrackRequest');
  }

  componentWillReceiveProps(nextProps: TrackRequestSwitchProps) {
    const {
      data: { TrackRequest: trackRequest = false }
    } = nextProps.settings;
    if (trackRequest !== this.props.settings.data.TrackRequest) {
      this.setState({ trackRequest });
    }
  }

  onChange = () => {
    this.setState({ value: !this.state.value }, () => {
      this.props.onChange(this.state.value);
    });
  };

  render() {
    const { textStyle, style, isFirstAvailable, hideDivider } = this.props;
    // TODO: Remove InputDivider from this component
    return (
      <React.Fragment>
        {this.state.trackRequest && !isFirstAvailable
          ? <React.Fragment>
            {hideDivider
              ? <InputDivider style={this.props.middleSectionDivider} />
              : null}
            <InputSwitch
              textStyle={textStyle}
              style={style}
              onChange={this.onChange}
              text="Provider is Requested?"
              value={this.state.value}
            />
          </React.Fragment>
          : null}
      </React.Fragment>
    );
  }
}

TrackRequestSwitch.defaultProps = {
  textStyle: {},
  style: {},
  hideDivider: true,
  initialValue: undefined,
  middleSectionDivider: {
    width: '95%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: '#DDE6F4',
  },
};

TrackRequestSwitch.propTypes = {
  textStyle: PropTypes.any,
  middleSectionDivider: PropTypes.any,
  style: PropTypes.any,
  settings: PropTypes.any,
  isFirstAvailable: PropTypes.bool.isRequired,
  hideDivider: PropTypes.bool,
  initialValue: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  settingsActions: PropTypes.shape({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  settings: state.settingsReducer,
});
const mapActionsToProps = dispatch => ({
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(
  TrackRequestSwitch
);
