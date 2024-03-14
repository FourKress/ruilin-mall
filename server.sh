#!/bin/bash

app_name="ruilin-mall"

echo '---开始执行git checkout main---'
git checkout main
echo '---开始执行git pull---'
git pull
echo '---git pull执行完毕，pnpm install---'
pnpm i
echo '---pnpm install执行完毕，开始执行pnpm build---'
pnpm build
echo '---开始执行pnpm build执行完毕 开始检查应用运行状态'
if pm2 ls | grep -q $app_name; then
  echo "---应用已经启动，开始检查应用运行状态---"
  app_status=$(pm2 show $app_name --no-color | grep "status" | awk '{print $4}')
  if [[ "$app_status" == *"online"* ]]; then
    echo "---应用正在运行中，执行reload重新加载---"
    MALL_APP_NAME=$app_name pm2 reload pm2.config.cjs --env production
  elif [[ "$app_status" == *"stopped"* ]]; then
    echo "---应用停止运行，执行restart重新启动---"
    MALL_APP_NAME=$app_name pm2 restart pm2.config.cjs --env production
  fi
else
  echo "---应用没有启动，执行start启动---"
  MALL_APP_NAME=$app_name pm2 start pm2.config.cjs --env production
fi

echo '---脚本执行完毕 服务启动成功---'
