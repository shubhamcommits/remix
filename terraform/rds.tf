# Generate a random password for the MySQL user
resource "random_password" "mysql_password" {
  length            = 32
  special           = false
}

# Create a secret for the MySQL credentials
resource "aws_secretsmanager_secret" "mysql_credentials" {
  name = "${local.rds_secret_name}"
}

# Add the MySQL credentials to the secret
resource "aws_secretsmanager_secret_version" "mysql_credentials" {
  secret_id = aws_secretsmanager_secret.mysql_credentials.id
  secret_string = jsonencode({
    username = "admin"
    password = random_password.mysql_password.result
  })
}

# Adding DB Subnet group
resource "aws_db_subnet_group" "db_subnet_group" {
  name = "${local.db_subnet_group_name}"
  subnet_ids = aws_subnet.public-subnet.*.id
}

# Create an RDS Aurora MySQL cluster
resource "aws_rds_cluster" "aurora_cluster" {
  engine_mode = "provisioned"
  engine = "aurora-mysql"

  database_name = "remixdb"
  master_username = jsondecode(aws_secretsmanager_secret_version.mysql_credentials.secret_string)["username"]
  master_password = jsondecode(aws_secretsmanager_secret_version.mysql_credentials.secret_string)["password"]

  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.sg.id]
  cluster_identifier = "${local.db_cluster_name}"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

  backup_retention_period = 7
  preferred_backup_window = "03:00-04:00"

  skip_final_snapshot = true
  
  tags = {
    Name        = local.db_cluster_name
    Environment = local.environment_name
    Owner       = local.owner_name
    Terraform   = true
  }
}

# Create an RDS Aurora MySQL instance in the cluster
resource "aws_rds_cluster_instance" "aurora_instance" {
  count                 = 2
  identifier            = "${local.db_instance_name}-${count.index}"
  cluster_identifier    = aws_rds_cluster.aurora_cluster.id
  instance_class        = "${local.db_instance_type}"
  engine_version        = "5.7.mysql_aurora.2.10.2"
  engine                = "aurora-mysql"
  publicly_accessible   = local.environment_name == "dev" ? true : false

  tags = {
    Name        = local.db_instance_name
    Environment = local.environment_name
    Owner       = local.owner_name
    Terraform   = true
  }
}

# Output the endpoint for connecting to the Aurora cluster
output "aurora_endpoint" {
  value = aws_rds_cluster.aurora_cluster.endpoint
}
