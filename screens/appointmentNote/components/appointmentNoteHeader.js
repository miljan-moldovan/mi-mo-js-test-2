import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';
import AppointmentNotes from '../../../constants/AppointmentNotes';


const AppointmentNoteHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'Roboto',
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    }}
    >
      {props.rootProps.navigation.state.params !== undefined &&
        props.rootProps.navigation.state.params.actionType === 'update'
          ? `${AppointmentNotes.update[1]}`
          : `${AppointmentNotes.new[1]}`}

    </Text>),
});


const mapStateToProps = state => ({
  appointmentNotesState: state.appointmentNotesReducer,
});

export default connect(mapStateToProps)(AppointmentNoteHeader);
