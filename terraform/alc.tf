# Create an aws launch configuration for our instances
resource "aws_launch_configuration" "alc" {
  depends_on = [
    var.ec2_default_ami,
    var.ec2_instance_type,
    var.launch_configuration_name,
    aws_security_group.sg
  ]
  name            = var.launch_configuration_name
  image_id        = var.ec2_default_ami
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg.id]

  # Install and configure Nginx
  user_data = file("scripts/setup-server.sh")

  # Attach Public IP Address
  associate_public_ip_address = true

  # Add 30GB storage
  root_block_device {
    volume_size           = 8
    delete_on_termination = true
    volume_type           = "gp2"
  }

  # Add IAM instance profile
  iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

  lifecycle {
    create_before_destroy = true
    prevent_destroy = true
  }
}