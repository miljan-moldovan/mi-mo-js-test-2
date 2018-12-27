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
  render() {
    const { assignment: { itemId, ...assignment } } = this.props;
    const labelStyle = assignment.isIncomplete
      ? { color: Colors.defaultRed }
      : {};
    const dividerStyle = assignment.isIncomplete
      ? { backgroundColor: Colors.defaultRed }
      : {};
    const roomLabel = assignment.room ? `${assignment.room.name} # ${assignment.roomOrdinal}` : 'None';
    const fromTimeLabel = isMoment(assignment.fromTime)
      ? assignment.fromTime.format(dateTimeConstants.displayTime)
      : 'Off';
    const toTimeLabel = isMoment(assignment.toTime) ? assignment.toTime.format(dateTimeConstants.displayTime) : '-';
    const onPressRoom = () => this.props.onPressRoom(itemId);
    const onPressFromTime = () => this.props.onPressFromTime(itemId);
    const onPressToTime = () => this.props.onPressToTime(itemId);
    return (
      <InputGroup style={styles.marginBottom} key={`assignment_${itemId}`}>
        <InputButton
          label="Room"
          labelStyle={labelStyle}
          value={roomLabel}
          onPress={onPressRoom}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          label="Start"
          labelStyle={labelStyle}
          value={fromTimeLabel}
          onPress={onPressFromTime}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          label="End"
          labelStyle={labelStyle}
          disabled={!isMoment(assignment.fromTime)}
          value={toTimeLabel}
          onPress={onPressToTime}
        />
      </InputGroup>
    );
  }
}
export default AssignmentForm;
