variable "region" { default = "ap-southeast-1" }
variable "access_key" {
  type      = string
  sensitive = true
}
variable "secret_key" {
  type      = string
  sensitive = true
}
variable "env" { default = "prod" }
variable "vpc_cidr" { default = "172.16.0.0/16" }
variable "instance_type" { default = "t4g.small" }
variable "db_engine" { default = "postgres" }
variable "db_port" { default = 5432 }
variable "allocated_storage" { default = 50 }
variable "db_instance_class" { default = "db.t3.medium" }
variable "db_name" { default = "prod_db" }
variable "db_user" { default = "prodadmin" }
variable "db_password" { default = "prod-db-pass" }
