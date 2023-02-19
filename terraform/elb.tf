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

  cross_zone_load_balancing = true

  tags = {
    Name        = local.elb_name
    Environment = local.environment_name
    Owner       = local.owner_name
  }
}