#!/bin/bash

echo $@
cp .env.production .env.production_bak

cat << EOF > .env.production
REACT_APP_DEFAULT_CHAIN_ID=56
REACT_APP_SUPPORT_CHAIN_IDS=56,97
EOF

yarn build
git checkout -- .env.production