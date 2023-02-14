#!/bin/bash

# Set Runtime Variables
APPS_DIR="/home/ec2-user/apps"

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
sudo npm install -g pm2

# Create Directory
mkdir -p $APPS_DIR

# Change Directory
cd $APPS_DIR

# Setup Repository
git clone https://github.com/shubhamcommits/remix.git

# Change Directory
cd $APPS_DIR/remix

# Add the necessary permissions to the script
chmod u+x ./deploy-app.sh

# Redeploy the application - PM2
./deploy-app.sh > $APPS_DIR/remix/deploy-app.log

# Return the Status
exit 1
