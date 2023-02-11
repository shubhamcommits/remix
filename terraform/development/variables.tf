# Define Your AWS Region
variable "aws_region" {
  description = "The AWS Region"
  default     = "us-east-1"
}

# Define Your VPC Name
variable "vpc_name" {
  description = "The VPC Name"
  default     = "dev-main-vpc"
}

# Define Your VPC CIDR Block
variable "vpc_cidr" {
  description = "The VPC CIDR Block"
  default     = "100.0.0.0/16"
}

# Define Your Environment
variable "environment_name" {
  description = "Environment Name"
  default     = "Development"
}

# Define the Owner Name
variable "owner_name" {
  description = "The Owner Name"
  default     = "Shubham"
}

# Fetch list of all AZs present in a Region
data "aws_availability_zones" "all" {}

# Output the Value of AZs
output "availability_zone_count" {
  value = length(data.aws_availability_zones.all.names)
}

# EC2 Default Instance Type
variable "ec2_instance_type" {
  default     = "t2.micro"
  description = "AWS EC2 Instance Type"
}

# EC2 Default Instance Name
variable "ec2_instance_name" {
  default     = "dev-remix-recipe-webserver"
  description = "AWS EC2 Instance Name"
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

# Launch EC2 Instance Role
variable "iam_role_launch_instance_name" {
  default     = "dev-role-launch-instance"
  description = "Launch Instance Role Name"
}

# IAM Instance Profile
variable "iam_instance_profile_name" {
  default     = "dev-iam-instance-profile"
  description = "The IAM Instance Profile Name"
}

# Security Group Name
variable "security_group_name" {
  default     = "dev-remix-recipe-security-group"
  description = "Security Group Name"
}

# Private Subnet Name
variable "private_subnet_name" {
  default     = "dev-private-subnet"
  description = "Private Subnet Name"
}

# Public Subnet Name
variable "public_subnet_name" {
  default     = "dev-public-subnet"
  description = "Public Subnet Name"
}

# Internet Gateway Name
variable "internet_gateway_name" {
  default     = "dev-main-internet-gateway"
  description = "The Internet Gateway Name"
}

# ELB Name
variable "elb_name" {
  default     = "dev-remix-recipe-load-balancer"
  description = "The ELB Name"
}