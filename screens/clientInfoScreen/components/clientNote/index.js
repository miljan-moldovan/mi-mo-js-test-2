import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ClientNoteHeader from './clientNoteHeader';

import clientNotesActions from '../../../../actions/clientNotes';

import {
  InputGroup,
  InputDivider,
  InputSwitch,
  InputDate,
  SectionDivider,
  SectionTitle,
  InputText,
  ProviderInput,
} from '../../../../components/formHelpers';

import fetchFormCache from '../../../../utilities/fetchFormCache';
import styles from './stylesClientNote';


class ClientNote extends Component {
  static compareByDate(a, b) {
    if (a.enterTime < b.enterTime) { return 1; }
    if (a.enterTime > b.enterTime) { return -1; }
    return 0;
  }

  state = {
    note: {
      id: Math.random().toString(),
      text: '',
      expiration: null,
      forClient: false,
      forQueue: false,
      forSales: false,
      isDeleted: false,
    },
    forSales: false,
    forQueue: false,
    forClient: false,
    isVisible: true,
  };

  componentWillMount() {
    let { note } = this.state;

    const { client } = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'update') {
      note = Object.assign({}, this.props.clientNotesState.onEditionNote);
      const cachedForm = fetchFormCache('ClientNoteUpdate', this.props.clientNotesState.onEditionNote.id, this.props.formCache);

      if (this.props.clientNotesState.onEditionNote.id === cachedForm.id) {
        note = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      const cachedForm = fetchFormCache('ClientNoteNew', client.id, this.props.formCache);

      if (cachedForm) {
        note = cachedForm;
        const selectedProvider = this.props.clientNotesState.selectedProvider ? this.props.clientNotesState.selectedProvider : {};
        const providerName = !selectedProvider.isFirstAvailable ? ((`${selectedProvider.name || ''} ${selectedProvider.lastName || ''}`).toUpperCase()) : 'First Available';

        note.enteredBy = providerName;
      } else {
        this.props.clientNotesActions.selectProvider(null);
      }
    }

    this.setState({
      note, forSales: note.forSales, forQueue: note.forQueue, forClient: note.forClient,
    });

    this.props.navigation.setParams({
      handlePress: () => this.saveNote(),
      handleGoBack: () => this.goBack(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navigation.state.params.actionType === 'new') {
      const { client } = this.props.navigation.state.params;
      if (this.shouldSave) {
        this.shouldSave = false;
        this.props.clientNotesActions.setClientNoteNewForm(
          client.id.toString(),
          prevState.note,
        );
      }
    } else if (this.shouldSave) {
      this.shouldSave = false;
      this.props.clientNotesActions.setClientNoteUpdateForm(prevState.note);
    }
  }

  onChangeProvider = (provider) => {
    this.props.clientNotesActions.selectProvider(provider);
    const { note } = this.state;

    const providerName = !provider.isFirstAvailable ? ((`${provider.name || ''} ${provider.lastName || ''}`).toUpperCase()) : 'First Available';

    note.enteredBy = providerName;
    this.setState({ note, isVisible: true }, this.checkCanSave);
  }

    onChangeText = (txtNote) => {
      const { note } = this.state;
      note.text = txtNote;
      this.shouldSave = true;
      this.setState({ note }, this.checkCanSave);
    }

    dismissOnSelect() {
      const { navigate } = this.props.navigation;
      this.setState({ isVisible: true });
      navigate('ClientNote', { ...this.props });
    }

  inputDate = (selectedDate) => {
    const { note } = this.state;
    note.expiration = selectedDate;
    this.shouldSave = true;
    this.setState({ note }, this.checkCanSave);
  }

  inputSwitchQueue = () => {
    const { note } = this.state;
    note.forQueue = !this.state.forQueue;
    this.shouldSave = true;
    this.setState({ note, forQueue: !this.state.forQueue }, this.checkCanSave);
  }

  inputSwitchClient = () => {
    const { note } = this.state;
    note.forClient = !this.state.forClient;
    this.shouldSave = true;
    this.setState({ note, forClient: !this.state.forClient }, this.checkCanSave);
  }

  inputSwitchSales = () => {
    const { note } = this.state;
    note.forSales = !this.state.forSales;
    this.shouldSave = true;
    this.setState({ note, forSales: !this.state.forSales }, this.checkCanSave);
  }


    handleOnNavigateBack = () => {
      this.setState({ isVisible: true });
    }

    handlePressProvider = () => {
      const { navigate } = this.props.navigation;
      const { selectedProvider } = this.props.clientNotesState;

      this.shouldSave = true;

      this.setState({ isVisible: false });

      if (selectedProvider) {
        navigate('Providers', {
          actionType: 'update',
          dismissOnSelect: this.dismissOnSelect,
          onNavigateBack: this.handleOnNavigateBack,
          ...this.props,
        });
      } else {
        navigate('Providers', {
          actionType: 'new',
          dismissOnSelect: this.dismissOnSelect,
          onNavigateBack: this.handleOnNavigateBack,
          ...this.props,
        });
      }
    }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  });
    checkCanSave = () => {
      let isNoteValid = false;
      if (this.props.navigation.state.params.actionType === 'update') {
        const { text } = this.state.note;
        isNoteValid = text && text.length;
      } else {
        const { note } = this.state;
        isNoteValid = note.text &&
          note.text.length > 0 &&
          note.expiration &&
          note.enteredBy;
      }

      this.props.navigation.setParams({ canSave: isNoteValid });
    }

    saveNote() {
      const { client } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
      debugger //eslint-disable-line
        const note = Object.assign({}, this.state.note);
        note.notes = note.text;
        delete note.text;
        delete note.id;
        delete note.isDeleted;

        this.props.clientNotesActions.postClientNotes(client.id, note)
          .then((response) => {
            this.props.clientNotesActions.selectProvider(null);
            this.props.navigation.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const { note } = this.state;
        note.notes = note.text;
        this.props.clientNotesActions.putClientNotes(client.id, note)
          .then((response) => {
            this.props.clientNotesActions.selectProvider(null);
            this.props.navigation.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      }
    }

    goBack() {
      if (this.props.navigation.state.params.actionType === 'new') {
        const { client } = this.props.navigation.state.params;
        this.props.clientNotesActions.purgeClientNoteNewForm(
          client.id.toString(),
          this.state.note,
        );
      } else {
        this.props.clientNotesActions.purgeClientNoteUpdateForm(this.state.note);
      }
      this.setState({ isVisible: false });
      this.props.navigation.goBack();
    }

  shouldSave = false

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}
      >
        <View style={styles.container}>
          <ClientNoteHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <View style={styles.topSeparator} />
            <InputGroup style={styles.providerInputGroup}>
              <ProviderInput
                apptBook
                noPlaceholder
                filterByService
                style={styles.innerRow}
                selectedProvider={this.props.clientNotesState.selectedProvider}
                labelText="Added By"
                iconStyle={styles.carretIcon}
                avatarSize={20}
                navigate={this.props.navigation.navigate}
                headerProps={{ title: 'Providers', ...this.cancelButton() }}
                onChange={this.onChangeProvider}
                onPress={this.handlePressProvider}
              />
            </InputGroup>
            <SectionTitle value="NOTE" style={styles.sectionTitle} />
            <InputGroup>
              <InputText
                placeholder="Write Note"
                onChangeText={this.onChangeText}
                value={this.state.note.text}
              />
            </InputGroup>
            <SectionTitle value="TYPES" style={styles.sectionTitle} />
            <InputGroup >
              <InputSwitch
                style={styles.inputSwitchSales}
                textStyle={styles.inputSwitchTextStyle}
                onChange={this.inputSwitchSales}
                value={this.state.forSales}
                text="Sales"
              />
              <InputDivider />
              <InputSwitch
                style={styles.inputSwitchClient}
                textStyle={styles.inputSwitchTextStyle}
                onChange={this.inputSwitchClient}
                value={this.state.forClient}
                text="Client"
              />
              <InputDivider />
              <InputSwitch
                style={styles.inputSwitchQueue}
                textStyle={styles.inputSwitchTextStyle}
                onChange={this.inputSwitchQueue}
                value={this.state.forQueue}
                text="Queue"
              />
            </InputGroup>
            <SectionDivider style={styles.sectionDivider} />

            <InputGroup style={styles.inputGroupDate}>
              <InputDate
                style={styles.inputDate}
                placeholder="Expire Date"
                noIcon={this.state.note.expiration == null}
                onPress={this.inputDate}
                valueStyle={this.state.note.expiration == null ? styles.valueStyleDate : {}}
                selectedDate={this.state.note.expiration == null ? 'Optional' : moment(this.state.note.expiration).format('DD MMMM YYYY')}
              />
            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

ClientNote.defaultProps = {

};

ClientNote.propTypes = {
  clientNotesActions: PropTypes.shape({
    setClientNoteNewForm: PropTypes.func.isRequired,
    setClientNoteUpdateForm: PropTypes.func.isRequired,
    selectProvider: PropTypes.func.isRequired,
    purgeClientNoteNewForm: PropTypes.func.isRequired,
    purgeClientNoteUpdateForm: PropTypes.func.isRequired,
    postClientNotes: PropTypes.func.isRequired,
    putClientNotes: PropTypes.func.isRequired,
  }).isRequired,
  clientNotesState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  formCache: PropTypes.any.isRequired,
};

const mapStateToProps = state => ({
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators({ ...clientNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNote);
