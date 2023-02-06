resource "aws_elb" "elb" {
  depends_on = [
    aws_security_group.sg,
    data.aws_availability_zones.all.names
  ]
  name               = "remix-recipe-server-elb"
  internal           = false
  security_groups    = [aws_security_group.sg]
  availability_zones = data.aws_availability_zones.all.names

  listener {
    instance_port     = 80
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }

  health_check {
    target              = "HTTP:80/"
    interval            = 30
    healthy_threshold   = 3
    unhealthy_threshold = 5
    timeout             = 3
  }

  tags = {
    Name        = "remix-recipe-server-elb",
    Environment = "Production"
    Owner       = "Shubham"
  }
}

resource "aws_launch_configuration" "alc" {
  image_id      = var.ec2_default_ami
  instance_type = var.ec2_instance_type
  security_groups = [ aws_security_group.sg ]
}

resource "aws_autoscaling_group" "asg" {

  launch_configuration      = aws_launch_configuration.alc.name
  availability_zones        = data.aws_availability_zones.all.names
  max_size                  = 10
  min_size                  = 1
  desired_capacity          = 2
  health_check_grace_period = 300
  subnet_ids                = aws_subnet.private-subnet[*].id
  vpc_zone_identifier       = [aws_subnet.private-subnet.*.id]

  tag {
    key                 = "Name"
    value               = "remix-recipe-server-asg"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_attachment" "asg_elb" {
  autoscaling_group_name  = aws_autoscaling_group.asg.name
  elb                     = aws_elb.elb.name
}

# Create the EC2 instance with 30GB storage
resource "aws_instance" "ec2_instance" {
  ami                         = var.ec2_default_ami
  instance_type               = var.ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.sg.id]
  subnet_id                   = aws_subnet.private-subnet[0].id
  associate_public_ip_address = false

  iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

  vpc_zone_identifier = [aws_subnet.private-subnet.*.id]

  # Add 30GB storage
  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  tags = {
    Name        = "remix-recipe-prod-instance"
    Environment = "Production"
    Owner       = "Shubham"
  }

  # Install and configure Nginx
  user_data = file("scripts/define-nginx.sh")
}