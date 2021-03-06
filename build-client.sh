#!/usr/bin/env bash

TPL_OUT_DIR=./app/templates
BUNDLE_FILE_NAME=client-bundle

mkdir -p "$TPL_OUT_DIR"

for TPL in `find app/server/views -name '*.hbs' | grep -ve /_`
do
    BASE_FILE_NAME=$(basename "$TPL")
    FILE_NAME="${BASE_FILE_NAME%.*}"
    echo Compiling $TPL
    ./handlebars "$TPL" -c "handlebars" -f "$TPL_OUT_DIR/$FILE_NAME.js"
done

echo Combining to $BUNDLE_FILE_NAME
./builder/bin/builder -c bundle.json `find app libs -name '*.js' | grep -ve server` > $BUNDLE_FILE_NAME.js

echo Uglyfing $BUNDLE_FILE_NAME.js to $BUNDLE_FILE_NAME.min.js
./node_modules/.bin/uglifyjs $BUNDLE_FILE_NAME.js -c -o $BUNDLE_FILE_NAME.min.js

echo GZiping $BUNDLE_FILE_NAME.min.js
#gzip -9 -f $BUNDLE_FILE_NAME.min.js

mkdir -p app/server/public/js

cp $BUNDLE_FILE_NAME.js app/server/public/js/client.min.js