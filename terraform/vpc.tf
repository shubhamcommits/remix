resource "aws_vpc" "main" {
  cidr_block           = local.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name        = local.vpc_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}