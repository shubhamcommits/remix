# Define an IAM role
resource "aws_iam_role" "role-launch-ec2" {
  depends_on = [
    local.owner_name,
    local.environment_name,
    local.iam_role_launch_instance_name
  ]

  name                = local.iam_role_launch_instance_name
  managed_policy_arns = [aws_iam_policy.ssm_policy.arn]
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = local.iam_role_launch_instance_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}

# Define SSM IAM Policy
resource "aws_iam_policy" "ssm_policy" {
  name = local.aws_ssm_iam_policy
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "VisualEditor0",
        Effect = "Allow",
        Action = [
          "ssm:*",
          "ec2:*",
          "ssmmessages:*",
          "ec2messages:*"
        ],
        Resource = "*"
      }
    ]
  })
}

# Define an IAM instance profile
resource "aws_iam_instance_profile" "ec2-instance-profile" {
  depends_on = [
    aws_iam_role.role-launch-ec2,
    local.owner_name,
    local.environment_name,
    local.iam_instance_profile_name
  ]

  name = local.iam_instance_profile_name
  role = aws_iam_role.role-launch-ec2.name

  tags = {
    Name        = local.iam_instance_profile_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}
