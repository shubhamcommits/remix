# Creat an SSM Role Specific to the document
resource "aws_iam_role" "ssm_role" {
  name = "${local.iam_role_ssm}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ssm.amazonaws.com"
        }
      }
    ]
  })
}

# Create an aws ssm document for our instances
resource "aws_ssm_document" "ssh_and_run_scripts" {
  name = "${local.ssm_document}"

  document_type = "Command"

  content = jsonencode({
    schemaVersion = "2.2"
    description = "SSH and run some scripts"
    mainSteps = [
      {
        action = "aws:runShellScript"
        name = "ssh_and_run_scripts"
        inputs = {
          inlineScript = <<-EOF
            #!/bin/bash

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
            yarn install

            # Build the application
            yarn run build

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

          EOF
          workingDirectory = ["/home/ec2-user"]
        }
      }
    ]
  })

  depends_on = [aws_iam_role.ssm_role]
}

# Fetch Currently Running Instances
data "aws_instance" "instances" {
  filter {
    name   = "tag:environment"
    values = [local.environment_name]
  }

  # Only run the command on running instances
  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}

# Attach the Associations With SSM
resource "aws_ssm_association" "ssh_and_run_scripts" {
    count = length(data.aws_instance.instances.ids)

    name = "${local.ssm_document}"

    targets {
        key    = "InstanceIds"
        values = [data.aws_instance.instances.ids[count.index]]
    }

    association_name = "${local.ssm_document}"

    document_version = "$LATEST"

    parameters = {
        workingDirectory = ["/home/ec2-user"]
    }

    depends_on = [aws_ssm_document.ssh_and_run_scripts]
}
# # Create an aws ssm document for our instances
# resource "aws_ssm_document" "setup_server" {
#   name          = local.ssm_document
#   document_type = "Command"

#   content = jsonencode({
#     schemaVersion = "2.2"
#     description   = "Setup Server Details"
#     mainSteps = [
#       {
#         action = "aws:runShellScript"
#         name   = "setupServer"
#         inputs = {
#           runCommand = [
#             "APPS_DIR=\"/home/ec2-user/apps\"",
#             "sudo yum update -y",
#             "sudo yum install git -y",
#             "sudo amazon-linux-extras install nginx1.12",
#             "sudo systemctl start nginx",
#             "sudo systemctl enable nginx",
#             "curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -",
#             "curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo",
#             "sudo yum install yarn -y",
#             "sudo npm install -g pm2",
#             "mkdir -p $APPS_DIR",
#             "cd $APPS_DIR",
#             "git clone https://github.com/shubhamcommits/remix.git",
#             "cd $APPS_DIR/remix"
#           ]
#         }
#       }
#     ]
#   })
# }

# # Associate SSM with Instances
# resource "aws_ssm_association" "setup_server_association" {
#   name = local.ssm_document

#   targets {
#       key    = "tag:Environment"
#       values = ["${local.environment_name}"]
#     }
  
# }
