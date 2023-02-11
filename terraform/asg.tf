# Create an aws auto scaling group for our instances
resource "aws_autoscaling_group" "asg" {
  depends_on = [
    aws_launch_configuration.alc,
    data.aws_availability_zones.all,
    var.ec2_instance_name,
    var.autoscaling_group_name,
    aws_subnet.public-subnet
  ]
  name                      = var.autoscaling_group_name
  launch_configuration      = aws_launch_configuration.alc.name
  vpc_zone_identifier       = aws_subnet.public-subnet.*.id
  max_size                  = 10
  min_size                  = 2
  desired_capacity          = 2
  health_check_grace_period = 300

 instance_refresh {
    strategy = "Rolling"
    triggers = ["tag"]
  }

  tag {
    key                 = "Name"
    value               = var.ec2_instance_name
    propagate_at_launch = true
  }

  # Required to redeploy without an outage.
  lifecycle {
    create_before_destroy = true
  }
}

# Create an attachment for our asg to the main elastic load balancer
resource "aws_autoscaling_attachment" "asg_elb" {
  depends_on = [
    aws_autoscaling_group.asg,
    aws_elb.elb
  ]
  autoscaling_group_name = aws_autoscaling_group.asg.name
  elb                    = aws_elb.elb.name
}