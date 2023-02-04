# Define Your AWS Region
variable "aws_region" {
  description = "The AWS Region"
  default     = "us-east-1"
}

# Fetch list of all AZs present in a Region
data "aws_availability_zones" "all" {}

# Calculate AZs Count
variable "availability_zone_count" {
  description = "Number of AZs to cover in a given AWS region"
  default = "${output.availability_zone_count.value}"
}

# Output the Value of AZs
output "availability_zone_count" {
  value = length(data.aws_availability_zones.all.names)
}

# EC2 Default Instance Type
variable "ec2_instance_type" {
  default     = "t2.micro"
  description = "AWS EC2 Instance Type"
}
