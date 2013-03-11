#!/usr/bin/env bash

TPL_OUT_DIR=app/templates

for TPL in `find app/server/views -name '*.dust'`
do
    BASE_FILE_NAME=$(basename "$TPL")
    FILE_NAME="${BASE_FILE_NAME%.*}"
    ./node_modules/.bin/dustc "$TPL" -n="app/templates/$FILE_NAME" -o "$TPL_OUT_DIR/$FILE_NAME.js"
done

./node_modules/.bin/browserbuild -c bundle.json `find app libs -name '*.js' | grep -ve server` > client-bundle.js