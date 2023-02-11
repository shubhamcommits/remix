#!/bin/bash

# Set Runtime Variables
PARAMATER="PROD_RECIPE_REMIX_ENV_VARS"
REGION="us-east-1"
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
sudo yarn global add pm2

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

# Get parameters and put it into .env file inside application root
aws ssm get-parameter --with-decryption --name $PARAMATER --region $REGION | jq '.Parameter.Value' > $APPS_DIR/remix/.env

# Redeploy the application
./deploy-app.sh

exit 1
