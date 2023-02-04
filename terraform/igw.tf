# Define Internet Gateway
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "main-internet-gateway"
        Environment = "Production"
        Owner = "Shubham"
    }
}

# Define Subnet Association with Route
resource "aws_route_table_association" "public_subnets_association" {
    count = length(data.aws_availability_zones.all.names)

    subnet_id = aws_subnet.public-subnet[count.index].id
    route_table_id = aws_vpc.main.default_route_table_id
}

# Define AWS Routes to Internet Access
resource "aws_route" "public_subnets_igw" {
    count = length(data.aws_availability_zones.all.names)

    route_table_id = aws_vpc.main.default_route_table_id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
}