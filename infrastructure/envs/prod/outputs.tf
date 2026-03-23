output "prod_backend_ip" {
  value = module.backend.instance_public_ip
}

output "prod_frontend_ip" {
  value = module.frontend.instance_public_ip
}

output "prod_rds_endpoint" {
  value = module.rds.db_endpoint
}
