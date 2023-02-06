resource "aws_elb" "elb" {
  depends_on = [
    aws_security_group.sg,
    data.aws_availability_zones.all,
    aws_instance.ec2_instance
  ]
  name            = "remix-recipe-server-elb"
  internal        = false
  security_groups = [aws_security_group.sg.id]
  subnets         = aws_subnet.private-subnet.*.id

  listener {
    instance_port     = 80
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

  instances                 = aws_instance.ec2_instance[*].id
  cross_zone_load_balancing = true

  tags = {
    Name        = "remix-recipe-server-elb",
    Environment = "Production"
    Owner       = "Shubham"
  }
}

resource "aws_launch_configuration" "alc" {
  depends_on = [
    var.ec2_default_ami,
    var.ec2_instance_type,
    aws_security_group.sg
  ]
  name            = "remix-recipe-prod-lc"
  image_id        = var.ec2_default_ami
  instance_type   = var.ec2_instance_type
  security_groups = [aws_security_group.sg.id]
}

resource "aws_autoscaling_group" "asg" {
  depends_on = [
    aws_launch_configuration.alc,
    data.aws_availability_zones.all
  ]
  name                      = "remix-recipe-prod-asg"
  launch_configuration      = aws_launch_configuration.alc.name
  vpc_zone_identifier       = aws_subnet.private-subnet.*.id
  max_size                  = 10
  min_size                  = 1
  desired_capacity          = 2
  health_check_grace_period = 300

  tag {
    key                 = "Name"
    value               = "remix-recipe-server-asg"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_attachment" "asg_elb" {
  depends_on = [
    aws_autoscaling_group.asg,
    aws_elb.elb
  ]
  autoscaling_group_name = aws_autoscaling_group.asg.name
  elb                    = aws_elb.elb.name
}

# Create the EC2 instance with 30GB storage
resource "aws_instance" "ec2_instance" {

  count = 2

  depends_on = [
    var.ec2_default_ami,
    var.ec2_instance_type,
    aws_security_group.sg,
    aws_subnet.private-subnet,
    aws_iam_instance_profile.ec2-instance-profile
  ]
  ami                         = var.ec2_default_ami
  instance_type               = var.ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.sg.id]
  subnet_id                   = aws_subnet.private-subnet[0].id
  associate_public_ip_address = false

  iam_instance_profile = aws_iam_instance_profile.ec2-instance-profile.name

  # Add 30GB storage
  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  tags = {
    Name        = "remix-recipe-prod-instance-${count.index + 1}"
    Environment = "Production"
    Owner       = "Shubham"
  }

  # Install and configure Nginx
  user_data = file("scripts/define-nginx.sh")
}