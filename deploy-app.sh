# Change Directory
cd /home/ec2-user/apps/remix

# Pull the changes
git pull origin master

# Install the dependencies
yarn install

# Build the application
yarn run build

# Kill all the running application
/usr/local/bin/pm2 kill

# List down the applications and initiate the deamon
/usr/local/bin/pm2 ls

# Setup the application
/usr/local/bin/pm2 start "yarn run dev" --name "remix-recipe-server"

# Init the application on server Startup
/usr/local/bin/pm2 startup

# Save the configuration on server
/usr/local/bin/pm2 save

# Enable the PM2-Root Service
systemctl enable pm2-root

# Start the PM2-Root Service
systemctl start pm2-root