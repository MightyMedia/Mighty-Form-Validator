#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$SCRIPT_DIR/../"
rm -rf "$SCRIPT_DIR/../vendor/"
php "$SCRIPT_DIR/../composer.phar" install
