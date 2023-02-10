# Create the EC2 instance
resource "aws_instance" "ec2_instance" {

  count = 2

  depends_on = [
    var.ec2_default_ami,
    var.ec2_instance_type,
    aws_security_group.sg,
    aws_subnet.private-subnet,
    aws_subnet.public-subnet,
    aws_iam_instance_profile.ec2-instance-profile
  ]
  ami                         = var.ec2_default_ami
  instance_type               = var.ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.sg.id]
  subnet_id                   = aws_subnet.public-subnet[0].id
  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

  tags = {
    Name        = "dev-remix-recipe-server-${count.index + 1}"
    Environment = "Development"
    Owner       = "Shubham"
  }

  # Install and configure Nginx
  user_data = file("scripts/setup-server.sh")
}