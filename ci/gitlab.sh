#!/bin/bash


cat <<END
SG has been triggered and will use the following args:
  - CI_BUILD_REF=$CI_BUILD_REF
  - CI_COMMIT_REF_NAME=$CI_COMMIT_REF_NAME
  - AC_API_TOKEN=$AC_API_TOKEN
  - AC_OWNER_NAME=$AC_OWNER_NAME
  - AC_APP_NAME=$AC_APP_NAME
END

json_value() {
  local json=${1}
  local value_name=${2}
  echo $json | python -c "import sys, json; print json.load(sys.stdin)['$value_name'];"
}

json_array_value() {
  local json=${1}
  local value_name=${2}
  echo $json | python -c "import sys, json; values=json.load(sys.stdin)['$value_name']; print \"\\n\".join(values);"
}

json_update_config() {
  local json=${1}
  echo $json | python -c "import sys, json; values=json.load(sys.stdin); del values['branch']; del values['id']; print json.dumps(values);"
}

handle_curl_return_code() {
  local error=$?
  if [ $error != 0 ]; then
    echo "Curl error $error"
    exit 1
  fi
}

echo "Sync repo..."
echo "Adding remote..."
git remote add bitbucket https://antonsu:bWDvUcTr3y2zxS6G7fFZ@bitbucket.org/salonultimate/pos.git || true
echo "Attempt to sync the branch..."
git push bitbucket refs/remotes/origin/$CI_COMMIT_REF_NAME:refs/heads/$CI_COMMIT_REF_NAME
echo "Waiting..."
sleep 20

DEVELOP_CONFIG=`curl -X GET "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/branches/develop/config" -H "accept: application/json" -H "X-API-Token: $AC_API_TOKEN"`
BRANCH_CONFIG=`json_update_config $DEVELOP_CONFIG`


echo "Attempt to push a new config for the branch..."
curl -sfX POST \
  "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/branches/$CI_COMMIT_REF_NAME/config" \
  -H 'Content-Type: application/json' \
  -H "X-API-Token: $AC_API_TOKEN" \
  -H 'accept: application/json' \
  -d "$BRANCH_CONFIG"

echo "Attempt to update config for the branch..."
curl -sfX PUT \
  "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/branches/$CI_COMMIT_REF_NAME/config" \
  -H 'Content-Type: application/json' \
  -H "X-API-Token: $AC_API_TOKEN" \
  -H 'accept: application/json' \
  -d "$BRANCH_CONFIG"

echo "Starting the build..."
START_RESULT=`curl -sfX POST "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/branches/$CI_COMMIT_REF_NAME/builds" -H "accept: application/json" -H "X-API-Token: $AC_API_TOKEN" -H "Content-Type: application/json" -d "{ \"debug\": false }"`

handle_curl_return_code

BUILD_NUMBER=`json_value "$START_RESULT" 'buildNumber'`
echo "Build number $BUILD_NUMBER"

echo "Checking pipeline status"
while true; do
  BUILD_INFO=`curl -sfX GET "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/builds/$BUILD_NUMBER" -H "accept: application/json" -H "X-API-Token: $AC_API_TOKEN"`
  handle_curl_return_code
  
  STATUS=`json_value "$BUILD_INFO" 'status'`
  case "$STATUS" in
    notStarted|inProgress)
      echo "Status $STATUS"
      sleep 20
      ;;

    completed)
      echo "The pipeline has completed"
      # LOGS_RESULT=`curl -sfX GET "https://api.appcenter.ms/v0.1/apps/$AC_OWNER_NAME/$AC_APP_NAME/builds/$BUILD_NUMBER/logs" -H "accept: application/json" -H "X-API-Token: $AC_API_TOKEN"`
#       handle_curl_return_code
#
#       LOGS=`json_array_value "$LOGS_RESULT" 'value'`
#       echo "-------------------------------------------------------------------------------------------------------"
#       echo "$LOGS"
#       echo "-------------------------------------------------------------------------------------------------------"
      RESULT=`json_value $BUILD_INFO 'result'`
      if [ $RESULT = "succeeded" ]; then
        exit 0
      else
        echo "The build has been failed"
        exit 1
      fi
      break
      ;;

    *)
      echo "The pipeline has failed, go to this link for more details/logs"
      exit 1
      ;;
  esac
done
