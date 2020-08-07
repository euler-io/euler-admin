#!/bin/bash

set -e

echo "yarn install"
yarn install
gatsby telemetry --disable

gatsby develop -H 0.0.0.0