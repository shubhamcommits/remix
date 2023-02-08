#!/bin/bash

sudo yum update -y
sudo yum install git -y
sudo amazon-linux-extras install nginx1.12
sudo systemctl start nginx
sudo systemctl enable nginx
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn -y
sudo yarn global add pm2
git clone https://github.com/shubhamcommits/remix.git
cd /remix
yarn install
yarn run build
pm2 start "yarn run dev" --name "prod-remix-recipe-server"

exit 1
