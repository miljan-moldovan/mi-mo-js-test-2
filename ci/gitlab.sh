#!/bin/bash


cat <<END
SG has been triggered and will use the following args:
  - CI_BUILD_REF=$CI_BUILD_REF
  - CI_COMMIT_REF_NAME=$CI_COMMIT_REF_NAME
  - AC_API_TOKEN=$AC_API_TOKEN
  - AC_OWNER_NAME=$AC_OWNER_NAME
  - AC_APP_NAME=$AC_APP_NAME
END


echo "Sync repo..."
echo "Adding a remote..."
git remote add bitbucket https://antonsu:bWDvUcTr3y2zxS6G7fFZ@bitbucket.org/salonultimate/pos.git || true
echo "Attempt to sync the branch..."
git push bitbucket refs/remotes/origin/$CI_COMMIT_REF_NAME:refs/heads/$CI_COMMIT_REF_NAME
echo "Waiting..."
sleep 20

$(dirname $0)/appcentre.sh
