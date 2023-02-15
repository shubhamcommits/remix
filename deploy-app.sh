# Set Runtime Variables
PARAMETER="DEV_RECIPE_REMIX_ENV_VARS"
REGION="us-east-1"
APPS_DIR="/home/ec2-user/apps"

# Check if directory exist
if [ ! -d $APPS_DIR ]; then

    # Print Outputs
    echo "Base Directory does not exist"
    echo "Executing commands for directory creation ..."

    # Change Directory
    cd $APPS_DIR

    # Clone the Directory
    git clone https://github.com/shubhamcommits/remix.git

else

    # Print Outputs
    echo "Base Directory already exists"
    echo "Continuing ..."

fi

# Change the Directory
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
pm2 kill

# List down the applications and initiate the deamon
pm2 ls

# Setup the application
pm2 start "npm run dev" --name "remix-recipe-server"

# Init the application on server Startup
pm2 startup systemd

# Save the configuration on server
pm2 save