# Provider configuration (Tránh hard-code vùng US-East-1)
provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

# 1. Gọi Module VPC
module "vpc" {
  source   = "../../modules/vpc"
  env      = var.env
  vpc_cidr = var.vpc_cidr
}

# 2. Gọi Module RDS (Database PostgreSQL)
module "rds" {
  source            = "../../modules/rds"
  env               = var.env
  vpc_id            = module.vpc.vpc_id
  db_engine         = var.db_engine
  db_port           = var.db_port
  allocated_storage = var.allocated_storage
  db_instance_class = var.db_instance_class
  db_name           = var.db_name
  db_user           = var.db_user
  db_password       = var.db_password
}

# 3. Instance cho Backend
module "backend" {
  source           = "../../modules/ec2"
  env              = var.env
  instance_name    = "backend-server"
  app_port         = 7070
  key_name         = var.key_name
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_id
  instance_type    = var.instance_type
}

# 4. Instance cho Frontend
module "frontend" {
  source           = "../../modules/ec2"
  env              = var.env
  instance_name    = "frontend-server"
  app_port         = 3000
  key_name         = var.key_name
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_id
  instance_type    = var.instance_type
}
