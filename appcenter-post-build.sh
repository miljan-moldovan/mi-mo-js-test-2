#!/usr/bin/env bash

./ios/Pods/Crashlytics/submit 57ed7a29664d211a062ac7a41c806fc3aeec24f2 069f729bbab573001180f1688cd1671414faa52c8894ba7b656b668bb4a52ecc \
  -groupAliases beta_testers \
  -notifications YES \
  -ipaPath @$APPCENTER_OUTPUT_DIRECTORY/SalonUltimateRN.ipa