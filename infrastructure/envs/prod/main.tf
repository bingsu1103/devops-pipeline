# Provider config cho Production (có thể khác vùng US-East)
provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

# 1. VPC Production (CIDR khác để tránh chồng lấn nếu cần peering)
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
  subnet_ids        = module.vpc.subnet_ids
  db_engine         = var.db_engine
  db_port           = var.db_port
  allocated_storage = var.allocated_storage
  db_instance_class = var.db_instance_class
  db_name           = var.db_name
  db_user           = var.db_user
  db_password       = var.db_password
}

# 3. Backend & Frontend Servers (Production)
module "backend" {
  source           = "../../modules/ec2"
  env              = var.env
  instance_name    = "backend-prod"
  app_port         = 7070
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_id
  instance_type    = var.instance_type
}

module "frontend" {
  source           = "../../modules/ec2"
  env              = var.env
  instance_name    = "frontend-prod"
  app_port         = 3000
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_id
  instance_type    = var.instance_type
}
