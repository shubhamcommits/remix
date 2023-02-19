# Set the Environment Name
variable "environment_name" {
  type = string
}

# Set the Application Name
variable "application_name" {
  type = string
}

# Set the Environment Name
locals {
  environment_name = var.environment_name
}

# Set the Application Name
locals {
  application_name = var.application_name
}

# Define Your AWS Region
locals {
  aws_region = "us-east-1"
}

# Define Your VPC Name
locals {
  vpc_name = "${local.environment_name}-main-vpc"
}

# Define Your VPC CIDR Block
locals {
  vpc_cidr = "10.0.0.0/16"
}

# Define the Owner Name
locals {
  owner_name = "Shubham"
}

# Fetch list of all AZs present in a Region
data "aws_availability_zones" "all" {}

# Fetch the SSM Policy
locals {
  aws_ssm_iam_policy = "${local.environment_name}-managed-ssm-policy"
}

# Fetch the AmazonSSMManagedInstanceCore Policy
locals {
  aws_ssm_managed_instance_core = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Fetch the AmazonSSMFullAccess
locals {
  aws_ssm_managed_full_access = "arn:aws:iam::aws:policy/AmazonSSMFullAccess"
}

# Fetch the AmazonEC2RoleforSSM
locals {
  aws_ssm_managed_ec2_role = "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM"
}


# Output the Value of AZs
output "availability_zone_count" {
  value = length(data.aws_availability_zones.all.names)
}

# EC2 Default Instance Type
locals {
  ec2_instance_type = "t2.micro"
}

# EC2 Default Instance Name
locals {
  ec2_instance_name = "${local.environment_name}-${local.application_name}-webserver"
}

# CIDR Block for Public Internet
locals {
  public_internet_cidr = "0.0.0.0/0"
}

# Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
locals {
  ec2_default_ami = "ami-0323c3dd2da7fb37d"
}

# Launch EC2 Instance Role
locals {
  iam_role_launch_instance_name = "${local.environment_name}-role-launch-instance"
}

# IAM Instance Profile
locals {
  iam_instance_profile_name = "${local.environment_name}-iam-instance-profile"
}

# Security Group Name
locals {
  security_group_name = "${local.environment_name}-${local.application_name}-security-group"
}

# Private Subnet Name
locals {
  private_subnet_name = "${local.environment_name}-private-subnet"
}

# Public Subnet Name
locals {
  public_subnet_name = "${local.environment_name}-public-subnet"
}

# Internet Gateway Name
locals {
  internet_gateway_name = "${local.environment_name}-main-internet-gateway"
}

# ELB Name
locals {
  elb_name = "${local.environment_name}-${local.application_name}-load-balancer"
}

# ASG Name
locals {
  autoscaling_group_name = "${local.environment_name}-${local.application_name}-auto-scaling-group"
}

# ALC Name
locals {
  launch_configuration_name = "${local.environment_name}-${local.application_name}-launch-configuration"
}

# Systems Manager Document
locals {
  ssm_document = "${local.environment_name}-${local.application_name}-ssm-document"
}

# Systems Manager Document
locals {
  iam_role_ssm = "${local.environment_name}-${local.application_name}-iam-role-ssm"
}