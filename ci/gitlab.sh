#!/bin/bash


cat <<END
==============================================================================
File         : $(basename "$0")
Description  : Force sync Git Lab with Bitbucket mirror
Version      : 1.0
==============================================================================
CI_BUILD_REF        : $CI_BUILD_REF
CI_COMMIT_REF_NAME  : $CI_COMMIT_REF_NAME
AC_API_TOKEN        : $AC_API_TOKEN
AC_OWNER_NAME       : $AC_OWNER_NAME
AC_APP_NAME         : $AC_APP_NAME
==============================================================================
END

echo "Syncing repo..."
echo "Adding a remote..."
git remote add bitbucket https://antonsu:bWDvUcTr3y2zxS6G7fFZ@bitbucket.org/salonultimate/pos.git || true
echo "Attempting to sync the branch..."
git push bitbucket refs/remotes/origin/$CI_COMMIT_REF_NAME:refs/heads/$CI_COMMIT_REF_NAME
echo "Waiting..."
sleep 20

$(dirname $0)/appcentre.sh
