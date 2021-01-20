#!/bin/bash

echo $@
# cp .env.production .env.production_bak
# cat << EOF > .env.production
# REACT_APP_DEFAULT_CHAIN_ID=3
# REACT_APP_SUPPORT_CHAIN_IDS=1,3,56,97
# EOF

yarn build
cp -r build/ teemo-exchange/
sshpass -p Dev@ExchangeDefiex scp -r teemo-exchange/ root@47.90.62.21:/home/web/web/teemo/