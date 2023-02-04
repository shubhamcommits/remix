# Define Your AWS Region
variable "aws_region" {
  description = "The AWS Region"
  default     = "us-east-1"
}

# Fetch list of all AZs present in a Region
data "aws_availability_zones" "all" {}

# Output the Value of AZs
locals {
  availability_zone_count = length(data.aws_availability_zones.all.names)
}

# Calculate AZs Count
variable "availability_zone_count" {
  description = "Number of AZs to cover in a given AWS region"
  default = "${local.availability_zone_count}"
}

# EC2 Default Instance Type
variable "ec2_instance_type" {
  default     = "t2.micro"
  description = "AWS EC2 Instance Type"
}
