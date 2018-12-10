import * as React from 'react';
import { View,
  FlatList,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import SuggestionListItem from './suggestionListItem';

const ITEM_HEIGHT = 60;

const styles = StyleSheet.create({

  list: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: '100%',
  },

});

class SuggestionList extends React.Component {
  static renderSeparator(show) {
    if (show) {
      return (<View
        style={{
            height: 1,
            width: '100%',
            backgroundColor: '#C0C1C6',
          }}
      />);
    }
    return (null);
  }

  constructor(props) {
    super(props);

    this.state = {
      list: props.list,
      boldWords: props.boldWords,
    };
  }

    state:{
      list:[],
    };

    componentWillReceiveProps(nextProps) {
      this.setState({
        list: nextProps.list,
        boldWords: nextProps.boldWords,
      });
    }


      renderItem = obj => (
        <View key={Math.random().toString()} style={{ height: ITEM_HEIGHT }}>
          <SuggestionListItem
            value={obj.item}
            boldWords={this.state.boldWords}
            onPress={this.props.onPress}
          />
        </View>)


      render() {
        return (
          <View style={styles.list}>
            <FlatList
              keyboardShouldPersistTaps="always"
              style={{ height: '100%', flex: 1 }}
              extraData={this.props}
              keyExtractor={(item, index) => index}
              data={this.state.list}
              renderItem={this.renderItem}
              ItemSeparatorComponent={() => SuggestionList.renderSeparator()}
            />
          </View>
        );
      }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SuggestionList);
