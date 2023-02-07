#!/bin/bash

# Update Yum Repository
sudo yum update -y

# Install git
sudo yum install git -y

# Install Nginx
sudo amazon-linux-extras install nginx1.12
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16

# Install pm2 globally
sudo npm install -g pm2

# Setup Directory
mkdir $PWD/apps

# Change Directory
cd $PWD/apps

# Setup Code
git clone https://github.com/shubhamcommits/remix.git

# Change Directory to remix
cd $PWD/remix

# Install Dependencies
npm install
npm run build

# Launch Application
pm2 start "npm run dev" --name "prod-remix-recipe-server"

exit 1
