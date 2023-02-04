# Define Your AWS Region
variable "aws_region" {
  description = "The AWS Region"
  default     = "us-east-1"
}

# Fetch list of all AZs present in a Region
data "aws_availability_zones" "all" {}

# Output the Value of AZs
output "availability_zone_count" {
  value = length(data.aws_availability_zones.all.names)
}

# Fetch List of Public Subnets
data "aws_subnet_ids" "public_subnets" {
  vpc_id = aws_vpc.main.id

  filter {
    name   = "tag:Name"
    values = ["public*"]
  }
}

# EC2 Default Instance Type
variable "ec2_instance_type" {
  default     = "t2.micro"
  description = "AWS EC2 Instance Type"
}

# CIDR Block for Public Internet
variable "public_internet_cidr" {
  default     = "0.0.0.0/0"
  description = "CIDR Block for Public Internet"
}

# Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
variable "ec2_default_ami" {
  default     = "ami-0323c3dd2da7fb37d"
  description = "Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type"
}