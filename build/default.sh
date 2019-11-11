#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$SCRIPT_DIR/../"
"$SCRIPT_DIR/../vendor/bin/node" "$SCRIPT_DIR/../node_modules/.bin/gulp" default
