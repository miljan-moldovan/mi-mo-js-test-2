import {createSelector} from 'reselect';
import {groupBy} from 'lodash';

const settingsSelector = state => state.settingsReducer.settings;

const groupedSettingsSelector = createSelector ([settingsSelector], settings =>
  groupBy (settings.data, 'settingName')
);

export default groupedSettingsSelector;
