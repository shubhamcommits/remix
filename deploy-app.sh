#!/bin/bash

APPS_DIR="/home/ec2-user/apps/remix"

# Create the Directory
mkdir -p $APPS_DIR

# Change the Directory
cd $APPS_DIR

# Install the dependencies
yarn install

# Kill all the running application
pm2 kill

# List down the applications and initiate the deamon
pm2 ls

# Setup the application
pm2 start "yarn run dev" --name "remix-recipe-server"

# Init the application on server Startup
pm2 startup systemd

# Save the configuration on server
pm2 save