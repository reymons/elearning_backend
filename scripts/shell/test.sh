#!/bin/sh

set -eu

env_file=.env.test

npm run test:run-containers
sleep 4 # wait til all the required services accept connections (TODO: find better approach)
NODE_ENV=test node --env-file $env_file scripts/migrate.js
set +e
npm run jest:test
set -e
npm run test:stop-containers

