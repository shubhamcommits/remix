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