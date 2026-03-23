output "backend_public_ip" {
  value = module.backend.instance_public_ip
}

output "frontend_public_ip" {
  value = module.frontend.instance_public_ip
}

output "rds_endpoint" {
  value = module.rds.db_endpoint
}
