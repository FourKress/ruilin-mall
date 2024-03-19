#!/bin/bash

branch=""
app_port=""

if [ "$1" == "test" ]
then
  branch="test"
  app_port="7777"
elif [ "$1" == "prod" ]
then
  branch="main"
  app_port="8888"
else
  echo '---参数错误，执行失败---'
  exit 1
fi

app_name="$1-ruilin-mall"

echo "---开始执行git checkout $branch---"
git checkout $branch
echo '---开始执行git pull---'
git pull
echo '---git pull执行完毕，pnpm install---'
pnpm i
echo '---pnpm install执行完毕，开始执行pnpm build---'
pnpm build:$1
echo '---开始执行pnpm build执行完毕 开始检查应用运行状态'
if pm2 ls | grep -q $app_name; then
  echo "---应用已经启动，开始检查应用运行状态---"
  app_status=$(pm2 show $app_name --no-color | grep "status" | awk '{print $4}')
  if [[ "$app_status" == *"online"* ]]; then
    echo "---应用正在运行中，执行reload重新加载---"
    MALL_APP_NAME=$app_name MALL_APP_PORT=$app_port pm2 reload pm2.config.cjs --env $1
  elif [[ "$app_status" == *"stopped"* ]]; then
    echo "---应用停止运行，执行restart重新启动---"
    MALL_APP_NAME=$app_name MALL_APP_PORT=$app_port pm2 restart pm2.config.cjs --env $1
  fi
else
  echo "---应用没有启动，执行start启动---"
  MALL_APP_NAME=$app_name MALL_APP_PORT=$app_port pm2 start pm2.config.cjs --env $1
fi

echo '---脚本执行完毕 服务启动成功---'
