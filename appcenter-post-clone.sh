watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
npm start -- --reset-cache
rm -rf $TMPDIR/haste-map-react-native-packager-*