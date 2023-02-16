# Creat an SSM Role Specific to the document
resource "aws_iam_role" "ssm_role" {
  depends_on = [
    local.iam_role_ssm
  ]

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
  depends_on = [
    aws_iam_role.ssm_role,
    local.ssm_document
  ]

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
          runCommand = [
            "PARAMETER=\"DEV_RECIPE_REMIX_ENV_VARS\"",
            "REGION=\"us-east-1\"",
            "APPS_DIR=\"/home/ec2-user/apps\"",
            "cd $APPS_DIR/remix",
            "aws --region $REGION ssm get-parameter --name $PARAMETER  --with-decryption --output text --query Parameter.Value > $APPS_DIR/remix/.env",
            "git pull origin master",
            "yarn install",
            "yarn run build",
            "pm2 kill",
            "pm2 ls",
            "pm2 start \"yarn run dev\" --name \"remix-recipe-server\"",
            "pm2 startup systemd",
            "pm2 save"
          ]
          workingDirectory = ["/home/ec2-user"]
        }
      }
    ]
  })
}

# Attach the Associations With SSM
resource "aws_ssm_association" "ssh_and_run_scripts" {
    name = "${local.ssm_document}"

    targets {
        key    = "tag:Name"
        values = ["${local.ec2_instance_name}"]
    }

    association_name = "${local.ssm_document}"

    document_version = "$LATEST"

    parameters = {}

    depends_on = [aws_ssm_document.ssh_and_run_scripts, local.ssm_document]
}