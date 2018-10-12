#!/bin/bash
set -eo pipefail
[ "$TRACE" = "true" ] && set -x

printenv

cat <<END
  SG has been triggered and will use the following args:
    - CI_BUILD_REF=$CI_BUILD_REF
    - AC_API_TOKEN=$AC_API_TOKEN
    - AC_OWNER_NAME=$AC_OWNER_NAME
    - AC_APP_NAME=$AC_APP_NAME
    - CI_COMMIT_REF_NAME=$CI_COMMIT_REF_NAME
END
