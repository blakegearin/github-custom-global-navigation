#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

NEW_VERSION=$1

# Update version
bash helpers/update-version.sh "$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo "Failed to update version. Aborting release."
  exit 1
fi

# Commit the changes
git add src/github-custom-global-navigation.user.js
git commit -m "Release commit for $NEW_VERSION"
if [ $? -ne 0 ]; then
  echo "Failed to commit changes. Aborting release."
  exit 1
fi

# Create a tag
git tag "$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo "Failed to create tag. Aborting release."
  exit 1
fi

# Push the commit
git push
if [ $? -ne 0 ]; then
  echo "Failed to push commit. Aborting release."
  exit 1
fi

# Push the tag
git push origin "$NEW_VERSION"
if [ $? -ne 0 ]; then
  echo "Failed to push tag. Aborting release."
  exit 1
fi

echo "Release $NEW_VERSION completed successfully."
