#!/bin/bash
cd /home/node/be-personal-site

pwd

echo "更新代码"
git pull

echo "更新依赖"
npm install

echo "重启项目"
npm run stop

npm run prod

echo "重启成功"