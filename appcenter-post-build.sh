#!/usr/bin/env bash

if [ "$APPCENTER_BRANCH" == "develop" ];
then
  echo "Uploading to Crashlytics"
  ./ios/Pods/Crashlytics/submit 57ed7a29664d211a062ac7a41c806fc3aeec24f2 069f729bbab573001180f1688cd1671414faa52c8894ba7b656b668bb4a52ecc \
  -groupAliases beta_testers \
  -notifications YES \
  -ipaPath $APPCENTER_OUTPUT_DIRECTORY/SalonUltimateRN.ipa
  
  curl -X POST -H 'Content-type: application/json' --data '{"text": "Available new build", "attachments": [{"color": "#36a64f","title": "Mobile POS","title_link": "https://betas.to/5k1zsCBG","actions": [{"type": "button","text": "Install","url": "https://betas.to/5k1zsCBG"}]}]}' https://hooks.slack.com/services/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 #su_mobileapp
else
    echo "Current branch is $APPCENTER_BRANCH"
fi