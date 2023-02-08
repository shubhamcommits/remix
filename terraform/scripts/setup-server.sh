#!/bin/bash

sudo yum update -y
sudo yum install git -y
sudo amazon-linux-extras install nginx1.12
sudo systemctl start nginx
sudo systemctl enable nginx
git clone https://github.com/shubhamcommits/remix.git
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 16
npm install -g pm2
mkdir $PWD/apps
cd $PWD/apps
cd $PWD/remix
npm install
npm run build
pm2 start "npm run dev" --name "prod-remix-recipe-server"

exit 1
