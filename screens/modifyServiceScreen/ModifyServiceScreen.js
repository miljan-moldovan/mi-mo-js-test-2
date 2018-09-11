import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  InputGroup,
  InputDivider,
  InputSwitch,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  PromotionInput,
  InputLabel,
} from '../../components/formHelpers';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    // const canSave = params.canSave || false;
    const canSave = true;
    return {
      tabBarVisible: false,
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {'serviceItem' in params ? 'Modify Service' : 'Add Service'}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity onPress={navigation.goBack}>
          <Text style={styles.leftButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => params.handleSave()}
        >
          <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = this.getStateFromParams();
    this.props.navigation.setParams({ ...params, handleSave: this.handleSave });
  }

  get canRemove() {
    const params = this.props.navigation.state.params || {};
    return 'onRemove' in params;
  }

  getStateFromParams = () => {
    const params = this.props.navigation.state.params || {};
    const serviceItem = params.serviceItem || {};
    const service = get(serviceItem, 'service', null);
    const employee = get(serviceItem, 'employee', null);
    const promotion = get(serviceItem, 'promotion', null);
    const price = get(service, 'price', 0);
    const isProviderRequested = get(service, 'isProviderRequested', true);
    return {
      price,
      service: {
        ...service,
        name: get(service, 'serviceName', get(service, 'name', null)),
      },
      employee,
      promotion,
      discount: 0,
      isProviderRequested,
    };
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  handleRemove = () => {
    const { onRemove = (itm => itm) } = this.props.navigation.state.params || {};
    onRemove();
    this.props.navigation.goBack();
  }

  handleSave = () => {
    const {
      service,
      employee,
      promotion,
    } = this.state;
    const { onSave = (itm => itm) } = this.props.navigation.state.params || {};
    onSave({
      service,
      employee,
      promotion,
    });
    this.props.navigation.goBack();
  }

  handleChangeEmployee = employee => this.setState({ employee }, this.validate)

  handleChangeService = service => this.setState({ service }, this.validate)

  handleChangePromotion = promotion => this.setState({ promotion }, this.validate)

  handleChangeRequested = isProviderRequested => this.setState({ isProviderRequested })

  render() {
    const { navigation: { navigate } } = this.props;
    const {
      price,
      discount,
      service,
      employee,
      promotion,
      isProviderRequested,
    } = this.state;
    const isFirstAvailable = get(employee, 'isFirstAvailable', false);
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            noPlaceholder
            navigate={navigate}
            selectedService={service}
            selectedProvider={employee}
            onChange={this.handleChangeService}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
          />
          <InputDivider />
          <ProviderInput
            noPlaceholder
            filterByService
            showFirstAvailable
            label="Provider"
            avatarSize={20}
            navigate={navigate}
            style={styles.innerRow}
            iconStyle={styles.carretIcon}
            onChange={this.handleChangeEmployee}
            selectedService={service}
            selectedProvider={employee}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
          {
            !isFirstAvailable ?
              <React.Fragment>
                <InputDivider />
                <InputSwitch
                  value={isProviderRequested}
                  onChange={this.handleChangeRequested}
                  text="Provider is requested?"
                />
              </React.Fragment> : null
          }
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <PromotionInput
            navigate={navigate}
            selectedPromotion={promotion}
            onChange={this.handleChangePromotion}
          />
          <InputDivider />
          <InputLabel label="Discount" value={discount} />
          <InputLabel label="Price" value={`$ ${price}`} />
        </InputGroup>
        <SectionDivider />
        {
          this.canRemove &&
          <InputGroup>
            <SalonTouchableOpacity
              style={styles.removeButton}
              onPress={this.handleRemove}
            >
              <Text style={styles.removeButtonText}>Remove Service</Text>
            </SalonTouchableOpacity>
          </InputGroup>
        }
      </View>
    );
  }
}
