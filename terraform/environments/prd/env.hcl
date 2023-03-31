locals {
  # Environment-specific variables can be defined here
  resource_group_name = "rg-recognize-super-cheetah-3000-prd"

  # Registry authentication
  registry_auth_tenant_id = "7a459d40-231f-4b13-b39c-f2c484b45125"
  registry_auth_client_id = "4ab70484-cf94-4e51-bdcf-f72d41d58aea"

  # Generic
  service_plan_sku_name = "B1"
  custom_domain = "sc3000.recognize.nl"
}
