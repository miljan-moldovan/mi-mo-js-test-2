// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
} from '../../../../components/formHelpers';

import WordHighlighter from '../../../../components/wordHighlighter';
import SalonTouchableHighlight from '../../../../components/SalonTouchableHighlight';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 330,
  },
  serviceName: {
    color: '#110A24',
    fontSize: 14,
    width: 300,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkIcon: {
    fontSize: 15,
    marginLeft: 10,
    textAlign: 'center',
    color: '#1DBF12',
  },
});

class ServiceListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      service: props.service,
      name: `${props.service.name}`,
      boldWords: props.boldWords,
      onPress: props.onPress,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      service: nextProps.service,
      name: `${nextProps.service.name}`,
      boldWords: nextProps.boldWords,
      onPress: nextProps.onPress,
    });
  }

  render() {
    return (

      <InputGroup style={{
        flexDirection: 'row',
        height: this.props.height,
        borderBottomWidth: 0,
        borderTopWidth: 0,
      }}
      >
        {[<SalonTouchableHighlight
          key={Math.random().toString()}
          style={styles.container}
          underlayColor="transparent"
          onPress={() => { this.props.onPress(this.props.service); }}
        >
          <View style={styles.inputRow}>
            <WordHighlighter
              highlight={this.props.boldWords}
              highlightStyle={styles.highlightStyle}
              style={styles.serviceName}
            >
              {this.state.name}
            </WordHighlighter>
            {this.props.service === this.props.servicesState.selectedService &&
              <FontAwesome style={styles.checkIcon}>
                {Icons.checkCircle}
              </FontAwesome>
            }
          </View>
        </SalonTouchableHighlight>,
      ]}
      </InputGroup>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ServiceListItem);
