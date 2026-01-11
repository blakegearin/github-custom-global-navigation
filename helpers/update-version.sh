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

# Update copyright end year if needed
CURRENT_YEAR=$(date +%Y)
# This will match lines like: // @copyright    2023–2025
sed -i '' -E "s|(// @copyright[[:space:]]+[0-9]{4})–[0-9]{4}|\1–$CURRENT_YEAR|" "$FILE"
if [ $? -ne 0 ]; then
  echo "Failed to update copyright year. Aborting."
  exit 1
fi

echo "Version updated to $NEW_VERSION and copyright year set to $CURRENT_YEAR in $FILE"
