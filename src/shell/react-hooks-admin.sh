#!/bin/bash

cd /home/git-repositories/react-hooks-admin/

pwd

echo "==============更新代码================"
git pull

echo "==============更新依赖================"
npm install

echo "==============打包项目================"
npm run build

echo "============删除原文件夹==============="
rm -rf /home/www/react-hooks-admin

echo "==========移动文件到指定位置/home/www/react-hooks-admin=========="
mkdir react-hooks-admin

mv /home/git-repositories/react-hooks-admin/dist/* /home/www/react-hooks-admin

echo "==============升级成功================"