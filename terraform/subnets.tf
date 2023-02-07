# Define Public Subnets
resource "aws_subnet" "public-subnet" {
  depends_on = [
    var.environment_name,
    var.owner_name,
    data.aws_availability_zones.all,
    aws_vpc.main,
    var.public_subnet_name
  ]

  count = length(data.aws_availability_zones.all.names)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.public_subnet_name}-az-${count.index + 1}"
    Environment = "${var.environment_name}"
    Owner       = "${var.owner_name}"
  }
}

# Define Private Subnets
resource "aws_subnet" "private-subnet" {
  depends_on = [
    var.environment_name,
    var.owner_name,
    data.aws_availability_zones.all,
    aws_vpc.main,
    var.private_subnet_name
  ]

  count                   = length(data.aws_availability_zones.all.names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 13, count.index)
  availability_zone       = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.private_subnet_name}-az-${count.index + 1}"
    Environment = "${var.environment_name}"
    Owner       = "${var.owner_name}"
  }
}