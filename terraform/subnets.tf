# Define Public Subnets
resource "aws_subnet" "public-subnet" {
  depends_on = [
    local.environment_name,
    local.owner_name,
    data.aws_availability_zones.all,
    aws_vpc.main,
    local.public_subnet_name
  ]

  count = length(data.aws_availability_zones.all.names)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${local.public_subnet_name}-az-${count.index + 1}"
    Environment = "${local.environment_name}"
    Owner       = "${local.owner_name}"
  }
}

# Define Private Subnets
resource "aws_subnet" "private-subnet" {
  depends_on = [
    local.environment_name,
    local.owner_name,
    data.aws_availability_zones.all,
    aws_vpc.main,
    local.private_subnet_name
  ]

  count                   = length(data.aws_availability_zones.all.names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${100 + count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name        = "${local.private_subnet_name}-az-${count.index + 1}"
    Environment = "${local.environment_name}"
    Owner       = "${local.owner_name}"
  }
}