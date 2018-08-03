import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
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

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    width: '100%',
    height: '100%',
  },
});

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
    let note = this.state.note;

    const { client } = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'update') {
      note = JSON.parse(JSON.stringify(this.props.clientNotesState.onEditionNote));

      const cachedForm = fetchFormCache('ClientNoteUpdate', this.props.clientNotesState.onEditionNote.id, this.props.formCache);

      if (this.props.clientNotesState.onEditionNote.id === cachedForm.id) {
        note = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      const cachedForm = fetchFormCache('ClientNoteNew', client.id, this.props.formCache);

      if (cachedForm) {
        note = cachedForm;
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
    const note = this.state.note;

    const providerName = !provider.isFirstAvailable ? ((`${provider.name || ''} ${provider.lastName || ''}`).toUpperCase()) : 'First Available';
    debugger //eslint-disable-line
    note.updatedBy = providerName;
    this.setState({ note, isVisible: true });
  }

  shouldSave = false

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

  isNoteValid() {
    if (this.state.note.text.length === 0) {
      return false;
    } else if (this.state.note.enteredBy === '') {
      return false;
    }

    return true;
  }

  saveNote() {
    if (this.isNoteValid()) {
      const notes = this.props.clientNotesState.notes;
      const { client } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
        const note = this.state.note;
        note.notes = note.text;
        note.enteredBy = note.updatedBy;
        this.props.clientNotesActions.postClientNotes(client.id, note)
          .then((response) => {
            this.props.clientNotesActions.selectProvider(null);
            this.props.navigation.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const note = this.state.note;
        note.notes = note.text;
        this.props.clientNotesActions.putClientNotes(client.id, note)
          .then((response) => {
            this.props.clientNotesActions.selectProvider(null);
            this.props.navigation.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      }
    } else {
      alert('Please fill all the fields');
    }
  }

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  });

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

  handleOnNavigateBack = () => {
    this.setState({ isVisible: true });
  }

  dismissOnSelect() {
    const { navigate } = this.props.navigation;
    this.setState({ isVisible: true });
    navigate('ClientNote');
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}
      >
        <View style={styles.container}>
          <ClientNoteHeader rootProps={this.props} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
            <View style={{ marginTop: 15.5, borderColor: 'transparent', borderWidth: 0 }} />
            <InputGroup style={{ height: 44 }}>
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
                onChange={(provider) => { this.onChangeProvider(provider); }}
                onPress={this.handlePressProvider}
              />
            </InputGroup>
            <SectionTitle value="NOTE" style={{ height: 38 }} />
            <InputGroup>
              {[<InputText
                placeholder="Write Note"
                onChangeText={(txtNote) => {
                        const note = this.state.note;
                        note.text = txtNote;
                        this.shouldSave = true;
                        this.setState({ note });
                    }}
                value={this.state.note.text}
              />]}

            </InputGroup>
            <SectionTitle value="TYPES" style={{ height: 37 }} />
            <InputGroup >
              {[<InputSwitch
                style={{ height: 43, flex: 1 }}
                textStyle={{ color: '#000000' }}
                onChange={(state) => {
                  const note = this.state.note;
                  note.forSales = !this.state.forSales;
                  this.shouldSave = true;
                  this.setState({ note, forSales: !this.state.forSales });
                }}
                value={this.state.forSales}
                text="Sales"
              />,
                <InputDivider />,
                <InputSwitch
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                    const note = this.state.note;
                    note.forClient = !this.state.forClient;
                    this.shouldSave = true;
                    this.setState({ note, forClient: !this.state.forClient });
                  }}
                  value={this.state.forClient}
                  text="Client"
                />,


                <InputDivider />,
                <InputSwitch
                  style={{ height: 43 }}
                  textStyle={{ color: '#000000' }}
                  onChange={(state) => {
                  const note = this.state.note;
                  note.forQueue = !this.state.forQueue;
                  this.shouldSave = true;
                  this.setState({ note, forQueue: state });
                 }}
                  value={this.state.forQueue}
                  text="Queue"
                />]}


            </InputGroup>
            <SectionDivider style={{ height: 37 }} />

            <InputGroup style={{ flex: 1, flexDirection: 'row' }}>
              {[<InputDate
                style={{ flex: 1 }}
                placeholder="Expire Date"
                noIcon={this.state.note.expiration == null}
                onPress={(selectedDate) => {
                const { note } = this.state;
                note.expiration = selectedDate;
                this.shouldSave = true;
                this.setState({ note });
              }}
                valueStyle={this.state.note.expiration == null ? {
                  fontSize: 14,
                  lineHeight: 22,
                  color: '#727A8F',
                  fontFamily: 'Roboto-Regular',
                } : {}}
                selectedDate={this.state.note.expiration == null ? 'Optional' : moment(this.state.note.expiration).format('DD MMMM YYYY')}
              />]}

            </InputGroup>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators({ ...clientNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNote);
