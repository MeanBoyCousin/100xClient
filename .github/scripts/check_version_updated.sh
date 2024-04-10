#!/bin/bash

NEW_VERSION=$(cat package.json | jq .version)

git checkout -f master

CURRENT_VERSION=$(cat package.json | jq .version)

echo NEW_VERSION: $NEW_VERSION
echo CURRENT_VERSION: $CURRENT_VERSION

if [ $NEW_VERSION == $CURRENT_VERSION ]; then
  echo Package version needs to be updated before merging into master.
  exit 1
fi

echo Happy to proceed with new version $NEW_VERSION.
exit 0
