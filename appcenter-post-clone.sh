#!/usr/bin/env bash
set -ex
git clean -xdf
git reset HEAD --hard

brew uninstall node@6
NODE_VERSION="8.3.0"
curl "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.pkg" > "$HOME/Downloads/node-installer.pkg"
sudo installer -store -pkg "$HOME/Downloads/node-installer.pkg" -target "/"