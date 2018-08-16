import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { get, remove } from 'lodash';
import { Client, Product } from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

import {
  InputGroup,
  ProductInput,
  InputDivider,
  ValidatableInput,
  ProviderInput,
} from '../../../components/formHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  cancelButton: {
    fontSize: 14,
    color: 'white',
  },
  inputGroupContainer: {
    marginTop: 15,
  },
});

const headerRightButtonStyle = (canSave) => {
  const style = {
    fontSize: 14,
    lineHeight: 22,
    color: canSave ? 'white' : 'rgba(0,0,0,0.3)',
  };
  return style;
};

export default class RecommendProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let canSave;
    if (params && params.isValidInfo) {
      canSave = params.isValidInfo();
    }
    return {
      headerRight: (
        <SalonTouchableOpacity
          onPress={() => {
            if (canSave) {
              params.saveInfo();
              navigation.goBack();
            }
          }}
        >
          <Text style={headerRightButtonStyle(canSave)}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  };

  isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  clientPhoneTypes = {
    cell: 2,
    home: 1,
    work: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      clientEmail: '',
      selectedProvider: null,
      selectedProduct: null,
    };
  }

  componentWillMount() {
    const client = this.props.navigation.getParam('client', {});
    this.setState({ clientEmail: client.email });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      isValidInfo: this.validateFields,
      saveInfo: this.handleSave,
    });
  }

  handleSave = async () => {
    if (this.validateFields()) {
      this.shouldSaveRecommendation();
      this.shouldUpdateClientInfo();
    }
  };

  createPhonesArr = (phones) => {
    const createPhone = (type) => {
      const cell = phones.find(itm => get(itm, 'type', null) === this.clientPhoneTypes[type]);
      if (!cell || !cell.value || !cell.value.trim()) {
        return { type: this.clientPhoneTypes[type], value: '' };
      }
      return cell;
    };
    return [createPhone('cell'), createPhone('home'), createPhone('work')];
  };

  shouldUpdateClientInfo = async () => {
    const { clientEmail } = this.state;
    const client = this.props.navigation.getParam('client', {});
    const hasEmailChanged = clientEmail !== client.email;
    const isValidEmail =
      this.isValidEmailRegExp.test(clientEmail) && clientEmail !== '' && hasEmailChanged;
    const phones = this.createPhonesArr(client.phones);
    remove(phones, o => o.value === '');
    if (!isValidEmail) {
      return false;
    }
    const email = isValidEmail ? clientEmail : client.email;
    const updated = await Client.putContactInformation(client.id, {
      id: client.id,
      email,
      phones,
      confirmationType: 1,
    });
    return updated;
  };

  shouldSaveRecommendation = async () => {
    const { clientEmail, selectedProduct, selectedProvider } = this.state;
    const client = this.props.navigation.getParam('client', {});
    const updated = await Product.postRecommendProduct({
      email: clientEmail,
      clientId: client.id,
      employeeId: selectedProvider.id,
      productId: selectedProduct.id,
    });
    return updated;
  };

  onValidateEmail = (isValid, isFirstValidation) =>
    this.setState((state) => {
      const newState = state;
      newState.isValidEmail = state.clientEmail !== undefined ? isValid : true;
      return newState;
    });

  handleSelectProvider = (selectedProvider) => {
    this.setState({
      selectedProvider,
    });
  };

  validateFields = () => {
    const { clientEmail, selectedProduct, selectedProvider } = this.state;
    return (
      selectedProduct &&
      selectedProvider &&
      this.isValidEmailRegExp.test(clientEmail) &&
      clientEmail !== ''
    );
  };

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  });

  handleChangeText = (clientEmail) => {
    this.setState({ clientEmail });
  };

  handleChangeProduct = (product) => {
    this.setState({ selectedProduct: product });
  };

  render() {
    const client = this.props.navigation.getParam('client', {});
    const { clientEmail, selectedProvider, selectedProduct } = this.state;
    return (
      <View style={styles.container}>
        <InputGroup style={styles.inputGroupContainer}>
          <ValidatableInput
            label="Email"
            value={clientEmail}
            isValid={this.isValidEmailRegExp.test(clientEmail)}
            validation={this.isValidEmailRegExp}
            onValidated={this.onValidateEmail}
            onChangeText={email => this.handleChangeText(email)}
          />
          <InputDivider
            style={{
              backgroundColor: this.isValidEmailRegExp.test(clientEmail) ? null : '#D1242A',
            }}
          />
        </InputGroup>
        <InputGroup style={styles.inputGroupContainer}>
          <ProductInput
            selectedProduct={selectedProduct}
            placeholder="Select a Product"
            onChange={product => this.handleChangeProduct(product)}
            navigate={this.props.navigation.navigate}
          />
          <InputDivider />
          <ProviderInput
            filterByService
            client={client}
            placeholder="Select a Provider"
            navigate={this.props.navigation.navigate}
            selectedProvider={selectedProvider}
            onChange={this.handleSelectProvider}
            goBack
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
        </InputGroup>
      </View>
    );
  }
}
