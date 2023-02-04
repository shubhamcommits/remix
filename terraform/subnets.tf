# Define Public Subnets
resource "aws_subnet" "public-subnet" {
  count = length(data.aws_availability_zones.all.names)
  
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-${count.index + 1}"
    Environment = "Production"
    Owner = "Shubham"
  }
}

# Define Private Subnets
resource "aws_subnet" "private-subnet" {
  count = length(data.aws_availability_zones.all.names)
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.${100 + count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.all.names[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name = "private-subnet-${count.index + 1}"
    Environment = "Production"
    Owner = "Shubham"
  }
}