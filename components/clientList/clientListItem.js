// @flow
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ListView,
  Text
} from 'react-native';

import { connect } from 'react-redux';
import ImageWrapper from '../imageWrapper';
import WordHighlighter from '../wordHighlighter';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class ClientListItem extends React.PureComponent {

  state = {

  }

  constructor(props) {
    super(props);
    this.state = {boldWords: props.boldWords };
  }

  componentWillReceiveProps(nextProps){
    this.setState({boldWords: nextProps.boldWords});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <ImageWrapper imageStyle={styles.clientAvatar} image={this.props.client.avatar}/>
        </View>

        <View style={styles.dataContainer}>

          <WordHighlighter
          highlight={this.props.boldWords}
          highlightStyle={styles.highlightStyle}
          style={styles.clientName}>
          {this.props.client.name}</WordHighlighter>

          <WordHighlighter
          highlight={this.props.boldWords}
          highlightStyle={styles.highlightStyle}
          style={styles.clientEmail}>
          {this.props.client.email}</WordHighlighter>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(ClientListItem);

const styles = StyleSheet.create({
  highlightStyle:{
      color: '#000',
      fontFamily: 'OpenSans-Bold'
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  clientName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent'
  },
  clientEmail: {
    color: '#1D1D26',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent'
  },
  avatarContainer:{
    flex: 1/2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginLeft:10,
  },
  clientAvatar:{
    borderRadius: 28,
    height: 59,
    width: 59,
  },
  dataContainer:{
    marginLeft:20,
    flex: 1.5,
    justifyContent: 'center',
    flexDirection: 'column'
  }
});
