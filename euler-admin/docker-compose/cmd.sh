#!/bin/bash

set -e

yarn install
gatsby telemetry --disable

GATSBY_APP_EULER_API_BASE_URL=${GATSBY_EULER_API_BASE_URL} gatsby develop -H 0.0.0.0