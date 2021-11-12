import * as React from 'react';
import { isMoment } from 'moment';
import {
  InputGroup,
  InputButton,
  InputDivider,
} from '@/components/formHelpers';
import styles from '../styles';
import Colors from '@/constants/Colors';
import { AssignmentFormProps } from '../interfaces';
import { dateTimeConstants } from '@/constants';

class AssignmentForm extends React.PureComponent<AssignmentFormProps> {
  onPressRoom = () => this.props.onPressRoom(this.props.assignment.itemId);

  onPressFromTime = () => this.props.onPressFromTime(this.props.assignment.itemId);

  onPressToTime = () => this.props.onPressToTime(this.props.assignment.itemId);

  render() {
    const { assignment: { itemId, ...assignment } } = this.props;
    const labelStyle = assignment.isIncomplete
      ? { color: Colors.defaultRed }
      : {};
    const dividerStyle = assignment.isIncomplete
      ? { backgroundColor: Colors.defaultRed }
      : {};
    const roomLabel = assignment.room ? `${assignment.room.name} # ${assignment.roomOrdinal}` : 'None';
    const fromTimeLabel = isMoment(assignment.fromTime) && assignment.fromTime.isValid()
      ? assignment.fromTime.format(dateTimeConstants.displayTime)
      : 'Off';
    const toTimeLabel = isMoment(assignment.toTime) && assignment.toTime.isValid()
      ? assignment.toTime.format(dateTimeConstants.displayTime)
      : '-';
    return (
      <InputGroup style={styles.marginBottom} key={`assignment_${itemId}`}>
        <InputButton
          label="Room"
          labelStyle={labelStyle}
          value={roomLabel}
          onPress={this.onPressRoom}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          disabled={!assignment.room}
          label="Start"
          labelStyle={labelStyle}
          value={fromTimeLabel}
          onPress={this.onPressFromTime}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          label="End"
          labelStyle={labelStyle}
          disabled={!assignment.room || (!isMoment(assignment.fromTime) || !assignment.fromTime.isValid())}
          value={toTimeLabel}
          onPress={this.onPressToTime}
        />
      </InputGroup>
    );
  }
}
export default AssignmentForm;
