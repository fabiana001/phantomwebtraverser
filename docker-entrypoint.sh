#!/bin/bash
set -e

npm install

mkdir -p log

# nohup redis-server &
exec "$@"
