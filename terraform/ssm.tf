# Create an aws ssm document for our instances
resource "aws_ssm_document" "setup_server" {
  name          = local.ssm_document
  document_type = "Command"

  content = jsonencode({
    schemaVersion = "2.2"
    description   = "Setup Server Details"
    mainSteps = [
      {
        action = "aws:runShellScript"
        name   = "setupServer"
        inputs = {
          runCommand = [
            "APPS_DIR=\"/home/ec2-user/apps\"",
            "sudo yum update -y",
            "sudo yum install git -y",
            "sudo amazon-linux-extras install nginx1.12",
            "sudo systemctl start nginx",
            "sudo systemctl enable nginx",
            "curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -",
            "curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo",
            "sudo yum install yarn -y",
            "sudo npm install -g pm2",
            "mkdir -p $APPS_DIR",
            "cd $APPS_DIR",
            "git clone https://github.com/shubhamcommits/remix.git",
            "cd $APPS_DIR/remix"
          ]
        }
      }
    ]
  })
}

# Associate SSM with Instances
resource "aws_ssm_association" "setup_server_association" {
  name = "install-nginx"

  targets {
      key    = "tag:Environment"
      values = ["${local.environment_name}"]
    }
  
}
