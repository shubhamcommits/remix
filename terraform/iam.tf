# Define an IAM role
resource "aws_iam_role" "role-launch-ec2" {
  name = "role-launch-ec2"
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
}

# Define an IAM instance profile
resource "aws_iam_instance_profile" "ec2-instance-profile" {
  name = "ec2_instance_profile"
  role = aws_iam_role.role-launch-ec2.name
}
