#!/bin/bash

NEW_VERSION=$(jq -r .version package.json)
CHANGE_LOG_MESSAGE=$(awk "/$NEW_VERSION/{flag=1;next} /##/{flag=0} flag" CHANGELOG.md)

if [ -z "$CHANGE_LOG_MESSAGE" ]; then
  echo No changelog entry found for new version.
  exit 1
fi

git fetch origin master --depth 1
git checkout origin/master

CURRENT_VERSION=$(jq -r .version package.json)

echo NEW_VERSION: $NEW_VERSION
echo CURRENT_VERSION: $CURRENT_VERSION

if [ $NEW_VERSION == $CURRENT_VERSION ]; then
  echo Package version needs to be updated before merging into master.
  exit 1
fi

echo Happy to proceed with new version $NEW_VERSION.
exit 0
