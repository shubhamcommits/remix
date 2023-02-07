resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  tags = {
    Name        = var.vpc_name
    Environment = var.environment_name
    Owner       = var.owner_name
  }
}