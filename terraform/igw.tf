# Define Internet Gateway
resource "aws_internet_gateway" "igw" {
  depends_on = [
    aws_vpc.main,
    local.owner_name,
    local.environment_name,
    local.internet_gateway_name
  ]

  vpc_id = aws_vpc.main.id

  tags = {
    Name        = local.internet_gateway_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}

# Define Subnet Association with Route
resource "aws_route_table_association" "public_subnets_association" {
  depends_on = [
    aws_vpc.main,
    data.aws_availability_zones.all,
    aws_subnet.public-subnet
  ]

  count = length(data.aws_availability_zones.all.names)

  subnet_id      = aws_subnet.public-subnet[count.index].id
  route_table_id = aws_vpc.main.default_route_table_id
}

# Define AWS Routes to Internet Access
resource "aws_route" "public_subnets_igw" {
  depends_on = [
    aws_vpc.main,
    local.public_internet_cidr,
    aws_internet_gateway.igw,
    data.aws_availability_zones.all
  ]

  count = length(data.aws_availability_zones.all.names)

  route_table_id         = aws_vpc.main.default_route_table_id
  destination_cidr_block = local.public_internet_cidr
  gateway_id             = aws_internet_gateway.igw.id
}