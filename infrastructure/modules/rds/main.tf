variable "env" { type = string }
variable "vpc_id" { type = string }
variable "db_instance_class" { type = string }
variable "db_engine" { type = string }
variable "db_name" { type = string }
variable "db_user" { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "db_port" { type = number }
variable "allocated_storage" { type = number }

resource "aws_security_group" "db_sg" {
  name   = "db-sg-${var.env}"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }
}

resource "aws_db_instance" "rds" {
  identifier           = "db-${var.env}"
  allocated_storage    = var.allocated_storage
  engine               = var.db_engine
  instance_class       = var.db_instance_class
  db_name              = var.db_name
  username             = var.db_user
  password             = var.db_password
  port                 = var.db_port
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  tags = { Name = "devops-rds-${var.env}" }
}

output "db_endpoint" { value = aws_db_instance.rds.endpoint }
