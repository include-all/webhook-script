#!/bin/bash
WORK_PATH='/usr/projects/back'
echo "更新代码"
git pull

echo "重启项目"
npm run reProd

echo "重启成功"