# Define an IAM role
resource "aws_iam_role" "role-launch-ec2" {
  depends_on = [
    var.owner_name,
    var.environment_name,
    var.iam_role_launch_instance_name
  ]

  name = var.iam_role_launch_instance_name
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
    Name        = var.iam_role_launch_instance_name
    Environment = var.environment_name
    Owner       = var.owner_name
  }
}

# Define SSM IAM Policy
resource "aws_iam_policy" "ssm_policy" {
  name = var.aws_ssm_iam_policy
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
        {
            Sid = "VisualEditor0",
            Effect = "Allow",
            Action = [
                "ssm:PutParameter",
                "ssm:LabelParameterVersion",
                "ssm:DeleteParameter",
                "ssm:UnlabelParameterVersion",
                "ssm:DescribeParameters",
                "ssm:GetParameterHistory",
                "ssm:GetParametersByPath",
                "ssm:GetParameters",
                "ssm:GetParameter",
                "ssm:DeleteParameters",
                "ssm:ListTagsForResource"
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
    var.owner_name,
    var.environment_name,
    var.iam_instance_profile_name
  ]

  name = var.iam_instance_profile_name
  role = aws_iam_role.role-launch-ec2.name

  tags = {
    Name        = var.iam_instance_profile_name
    Environment = var.environment_name
    Owner       = var.owner_name
  }
}
