export interface SettingsActions {
  getSettingsByName: (name: string, callback?: () => void) => void;
  getSettings: (callback?: () => void) => void;
};