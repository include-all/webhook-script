#!/bin/bash
cd /home/node/koa-ts-app 

pwd

echo "更新代码"
git pull

echo "重启项目"
npm run stop

npm run prod

echo "重启成功"