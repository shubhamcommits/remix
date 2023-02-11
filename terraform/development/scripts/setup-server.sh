#!/bin/bash

# Update Packages
sudo yum update -y

# Install git
sudo yum install git -y

# Install nginx
sudo amazon-linux-extras install nginx1.12

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

# Install yarn
sudo yum install yarn -y

# Install pm2
sudo yarn global add pm2

# Create Directory
mkdir -p /home/ec2-user/apps

# Change Directory
cd /home/ec2-user/apps

# Setup Repository
git clone https://github.com/shubhamcommits/remix.git

# Change Directory
cd /home/ec2-user/apps/remix

# Install the dependencies
yarn install

# Build the application
yarn run build

# Setup the application
pm2 start "yarn run dev" --name "remix-recipe-server"

exit 1
