#!/bin/bash
set -eo pipefail
[ "$TRACE" = "true" ] && set -x

printenv

## for debugging
# export SG_EXTRA_CONFIG='{
# "parts": {
#   "api": {
#     "source": {
#       "docker": {
#         "tag": "17222"
#       }
#     }
#   }
# }
# }'
# export SG_PARTS=' api '
# export SG_FLAVOR=bb
# export SG_BRANCH=develop
# export CI_ENVIRONMENT_NAME=dev
# export CI_JOB_TOKEN=531fd76a147d8fa05d8357ad203782

#echo ${SG_BRANCH:=develop} > /dev/null

cat <<END
  SG has been triggered and will use the following args:
    - SG_EXTRA_CONFIG=$SG_EXTRA_CONFIG
    - SG_PARTS=$SG_PARTS
    - SG_FLAVOR=$SG_FLAVOR
    - SG_BRANCH=$SG_BRANCH
    - CI_ENVIRONMENT_NAME=$CI_ENVIRONMENT_NAME
    - CI_JOB_TOKEN=$CI_JOB_TOKEN
END
