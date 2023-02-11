# Change Directory
cd /home/ec2-user/apps/remix

# Pull the changes
git pull origin master

# Install the dependencies
npm install

# Build the application
npm run build

# Kill all the running application
pm2 kill

# List down the applications and initiate the deamon
pm2 ls

# Setup the application
pm2 start "npm run dev" --name "remix-recipe-server"

# Init the application on server Startup
pm2 startup systemd

# Save the configuration on server
pm2 save