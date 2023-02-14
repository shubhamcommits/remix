# Create an elb for our instances
resource "aws_elb" "elb" {
  depends_on = [
    local.elb_name,
    local.environment_name,
    local.owner_name,
    aws_security_group.sg,
    data.aws_availability_zones.all
  ]
  name            = local.elb_name
  internal        = false
  security_groups = [aws_security_group.sg.id]
  subnets         = aws_subnet.public-subnet.*.id

  listener {
    instance_port     = 3000
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }

  health_check {
    target              = "HTTP:80/"
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 5
    timeout             = 3
  }

  cross_zone_load_balancing = true

  tags = {
    Name        = local.elb_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}

# Create the EC2 instance with 30GB storage
# resource "aws_instance" "ec2_instance" {

#   count = 2

#   depends_on = [
#     local.ec2_default_ami,
#     local.ec2_instance_type,
#     aws_security_group.sg,
#     aws_subnet.private-subnet,
#     aws_subnet.public-subnet,
#     aws_iam_instance_profile.ec2-instance-profile
#   ]
#   ami                         = local.ec2_default_ami
#   instance_type               = local.ec2_instance_type
#   vpc_security_group_ids      = [aws_security_group.sg.id]
#   subnet_id                   = aws_subnet.public-subnet[0].id
#   associate_public_ip_address = true

#   iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

#   # Add 30GB storage
#   root_block_device {
#     volume_size = 30
#     volume_type = "gp2"
#   }

#   tags = {
#     Name        = "remix-recipe-prod-instance-${count.index + 1}"
#     Environment = "Production"
#     Owner       = "Shubham"
#   }

#   # Install and configure Nginx
#   user_data = file("scripts/define-nginx.sh")
# }