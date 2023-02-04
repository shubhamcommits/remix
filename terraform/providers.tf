# Specify the provider and access details
provider "aws" {}

# Default Backend for Configuration and Terraform States
terraform {
  backend "s3" {}
}