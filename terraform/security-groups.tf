# Create a security group to allow incoming traffic on port 22, 80, 443, 3000
resource "aws_security_group" "sg" {
  depends_on = [
    aws_vpc.main,
    var.security_group_name,
    var.environment_name,
    var.owner_name,
    var.public_internet_cidr
  ]

  name        = var.security_group_name
  description = "Allow HTTP and HTTPS traffic"

  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.public_internet_cidr]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.public_internet_cidr]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.public_internet_cidr]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [var.public_internet_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.public_internet_cidr]
  }

  tags = {
    Name        = var.security_group_name
    Environment = var.environment_name
    Owner       = var.owner_name
  }
}