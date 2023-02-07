# Create the EC2 instance with 30GB storage
# resource "aws_instance" "ec2_instance" {
#   count = length(aws_subnet.public-subnet)

#   ami                         = var.ec2_default_ami
#   instance_type               = var.ec2_instance_type
#   vpc_security_group_ids      = [aws_security_group.sg.id]
#   subnet_id                   = aws_subnet.public-subnet[count.index].id
#   associate_public_ip_address = true

#   iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

#   # Add 30GB storage
#   root_block_device {
#     volume_size = 30
#     volume_type = "gp2"
#   }

#   tags = {
#     Name        = "remix-recipe-nginx-instance-${count.index + 1}"
#     Environment = "Production"
#     Owner       = "Shubham"
#   }

#   # Install and configure Nginx
#   user_data = file("scripts/define-nginx.sh")
# }

# Create the Elastic IP Address
# resource "aws_eip" "eip" {
#   count = length(aws_instance.ec2_instance)
#   vpc = true
#   instance = aws_instance.ec2_instance[count.index].id
# }

# Network Interface for EC2 Instance
# resource "aws_network_interface" "ani" {
#   count = length(aws_subnet.public-subnet)
#   subnet_id = aws_subnet.public-subnet[count.index].id
#   security_groups = [aws_security_group.sg.id]

#   private_ips = ["10.0.${count.index}.10"]
# }

# Attach Network Interface to EC2 Instance
# resource "aws_instance_network_interface_attachment" "network_attachment" {
#   count = length(aws_subnet.public-subnet)
#   instance_id = aws_instance.ec2_instance[count.index].id
#   network_interface_id = aws_network_interface.ani[count.index].id
#   device_index = 0
# }
