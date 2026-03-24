variable "region" { default = "ap-southeast-1" }
variable "env" { default = "prod" }
variable "vpc_cidr" { default = "172.16.0.0/16" }
variable "instance_type" { default = "t4g.small" }
variable "db_engine" { default = "postgres" }
variable "db_port" { default = 5432 }
variable "allocated_storage" { default = 20 }
variable "db_instance_class" { default = "db.t3.micro" }
variable "db_name" { default = "prod_db" }
variable "db_user" { default = "prodadmin" }
variable "db_password" {}
variable "backend_port" {}
variable "frontend_port" {}
variable "ssh_key" {}
