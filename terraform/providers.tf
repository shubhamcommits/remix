# Specify the provider and access details
provider "aws" {
  region = var.aws_region
}

# Default Backend for Configuration and Terraform States
terraform {
  backend "s3" {}
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}