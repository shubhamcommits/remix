# Set Runtime Variables
PARAMETER="PROD_RECIPE_REMIX_ENV_VARS"
REGION="us-east-1"
APPS_DIR="/home/ec2-user/apps"

# Change Directory
cd $APPS_DIR/remix

# Get parameters and put it into .env file inside application root
aws --region $REGION ssm get-parameter --name $PARAMETER  --with-decryption --output text --query Parameter.Value > $APPS_DIR/remix/.env

# Pull the changes
git pull origin master

# Install the dependencies
npm install

# Build the application
npm run build

# Kill all the running application
/bin/pm2 kill

# List down the applications and initiate the deamon
/bin/pm2 ls

# Setup the application
/bin/pm2 start "npm run dev" --name "remix-recipe-server"

# Init the application on server Startup
/bin/pm2 startup systemd

# Save the configuration on server
/bin/pm2 save