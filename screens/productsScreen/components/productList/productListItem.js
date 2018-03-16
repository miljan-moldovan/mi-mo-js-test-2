// @flow
import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
} from '../../../../components/formHelpers';

import WordHighlighter from '../../../../components/wordHighlighter';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productName: {
    color: '#110A24',
    fontSize: 14,
    width: 222,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sizeLabelText: {
    fontSize: 11,
    lineHeight: 22,
    width: 51,
    color: '#0C4699',
    textAlign: 'left',
    fontFamily: 'Roboto-Regular',
  },
  priceLabelText: {
    fontSize: 14,
    lineHeight: 22,
    width: 50,
    color: '#727A8F',
    textAlign: 'right',
    fontFamily: 'Roboto-Regular',
  },
  checkIcon: {
    fontSize: 15,
    marginLeft: 5,
    textAlign: 'center',
    color: '#1DBF12',
  },
});

class ProductListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      name: `${props.product.name}`,
      boldWords: props.boldWords,
      onPress: props.onPress,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      product: nextProps.product,
      name: `${nextProps.product.name}`,
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
        {[<TouchableHighlight
          key={Math.random().toString()}
          style={styles.container}
          underlayColor="transparent"
          onPress={() => { this.props.onPress(this.props.product); }}
        >
          <View style={styles.inputRow}>
            <WordHighlighter
              highlight={this.props.boldWords}
              highlightStyle={styles.highlightStyle}
              style={styles.productName}
            >
              {this.state.name}
            </WordHighlighter>

            <View style={styles.inputRow}>
              <Text style={[styles.sizeLabelText]}>{this.state.product.size}</Text>
              <Text style={[styles.priceLabelText]}>{this.state.product.price}</Text>
              {this.props.product === this.props.productsState.selectedProduct &&
                <FontAwesome style={styles.checkIcon}>{Icons.checkCircle}
                </FontAwesome>
              }
            </View>
          </View>
          </TouchableHighlight>,
      ]}
      </InputGroup>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProductListItem);
