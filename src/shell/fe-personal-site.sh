#!/bin/bash

cd /home/git-repositories/fe-personal-site/

pwd

echo "==============更新代码================"
git pull

echo "==============更新依赖================"
npm install

echo "==============打包项目================"
npm run build

echo "============删除原文件夹==============="
rm -rf /home/www/fe-personal-site

echo "==========移动文件到指定位置/home/www/react-hooks-admin=========="
mkdir /home/www/fe-personal-site

mv /home/git-repositories/fe-personal-site/dist/* /home/www/fe-personal-site

echo "==============升级成功================"