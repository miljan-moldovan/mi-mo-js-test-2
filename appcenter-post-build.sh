#!/usr/bin/env bash

if [ "$APPCENTER_BRANCH" == "develop" ];
then
  git log -n 1 --pretty=oneline --abbrev-commit >> last_commit.txt

  echo "Uploading to Crashlytics"
  ./ios/Pods/Crashlytics/submit 57ed7a29664d211a062ac7a41c806fc3aeec24f2 069f729bbab573001180f1688cd1671414faa52c8894ba7b656b668bb4a52ecc \
  -groupAliases beta_testers \
  -notesPath ./last_commit.txt \
  -notifications YES \
  -ipaPath $APPCENTER_OUTPUT_DIRECTORY/SalonUltimateRN.ipa

  rm ./last_commit.txt

  GIT_HASH=`git log --pretty=format:'%h' -n 1`
  GIT_BRANCH=`git symbolic-ref --short HEAD`
  GIT_COMMIT_MESSAGE=`git log -1 --pretty=%B`
  curl -X POST -H 'Content-type: application/json' --data "{\"text\": \"Available new build\", \"attachments\": [{\"color\": \"#36a64f\",\"title\": \"Mobile POS\",\"title_link\": \"https://betas.to/5k1zsCBG\",\"fields\": [{\"title\": \"Git Branch\",\"value\": \"$GIT_BRANCH\",},{\"title\": \"Git Hash\",\"value\": \"$GIT_HASH\"},{\"title\": \"Git Commit\",\"value\": \"$GIT_COMMIT_MESSAGE\"},{\"title\": \"Build ID\",\"value\": \"$APPCENTER_BUILD_ID\"}],\"actions\": [{\"type\": \"button\",\"text\": \"Install\",\"url\": \"https://betas.to/5k1zsCBG\"}]}]}" https://hooks.slack.com/services/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 #su_mobileapp
    
  LAST_COMMITS=`git log -n 10 --pretty=oneline --abbrev-commit  | sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g'` #| sed "s/'/\"/g"
  curl -X POST -H 'Content-type: application/json' --data "{\"text\": \"Available new build\", \"attachments\": [{\"text\": \"$LAST_COMMITS\",\"color\": \"#36a64f\",\"title\": \"Mobile POS\",\"title_link\": \"https://betas.to/5k1zsCBG\",\"fields\": [{\"title\": \"Git Branch\",\"value\": \"$GIT_BRANCH\",},{\"title\": \"Git Hash\",\"value\": \"$GIT_HASH\"},{\"title\": \"Git Commit\",\"value\": \"$GIT_COMMIT_MESSAGE\"},{\"title\": \"Build ID\",\"value\": \"$APPCENTER_BUILD_ID\"}],\"actions\": [{\"type\": \"button\",\"text\": \"Install\",\"url\": \"https://betas.to/5k1zsCBG\"}]}]}" https://hooks.slack.com/services/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 #mobile_development

else
    echo "Current branch is $APPCENTER_BRANCH"
fi