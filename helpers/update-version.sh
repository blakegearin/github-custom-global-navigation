#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

NEW_VERSION=$1
FILE="src/github-custom-global-navigation.user.js"

if [ ! -f "$FILE" ]; then
  echo "File $FILE not found!"
  exit 1
fi

# Update @version line with flexible spacing
sed -i '' -E "s|@version[[:space:]]+[0-9]+\.[0-9]+\.[0-9]+|@version      $NEW_VERSION|" "$FILE"
if [ $? -ne 0 ]; then
  echo "Failed to update @version. Aborting."
  exit 1
fi

# Update const VERSION declaration
sed -i '' -E "s|const VERSION = '[0-9]+\.[0-9]+\.[0-9]+';|const VERSION = '$NEW_VERSION';|" "$FILE"
if [ $? -ne 0 ]; then
  echo "Failed to update VERSION. Aborting."
  exit 1
fi

if [ $? -eq 0 ]; then
  echo "Version updated to $NEW_VERSION in $FILE"
else
  echo "Failed to update version in $FILE"
  exit 1
fi
