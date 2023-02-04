# Define Internet Gateway
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "main-internet-gateway"
        Environment = "Production"
        Owner = "Shubham"
    }
}

# Fetch List of Public Subnets
data "aws_subnet_ids" "public_subnets" {
  vpc_id = aws_vpc.main.id

  filter {
    name   = "tag:Owner"
    values = ["Shubham"]
  }
}

# Define Subnet Association with Route
resource "aws_route_table_association" "public_subnets_association" {
    count = length(data.aws_subnet_ids.public_subnets)

    subnet_id = data.aws_subnet_ids.public_subnets[count.index].id
    route_table_id = aws_vpc.main.default_route_table_id
}

# Define AWS Routes to Internet Access
resource "aws_route" "public_subnets_igw" {
    count = length(data.aws_subnet_ids.public_subnets.id)

    route_table_id = aws_vpc.main.default_route_table_id
    destination_cidr_block = var.public_internet_cidr
    gateway_id = aws_internet_gateway.igw.id
}