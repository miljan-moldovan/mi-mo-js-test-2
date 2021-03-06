import * as React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const NewAppointmentNoteHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'Roboto',
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    }}
    >
    Note
    </Text>),
});

const mapStateToProps = state => ({
  appointmentNoteState: state.appointmentNoteReducer,
});
export default connect(mapStateToProps)(NewAppointmentNoteHeader);
