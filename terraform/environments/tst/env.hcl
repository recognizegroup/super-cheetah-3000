locals {
  # Environment-specific variables can be defined here
  resource_group_name = "rg-recognize-super-cheetah-3000-tst"

  # Registry authentication
  registry_auth_tenant_id = "7a459d40-231f-4b13-b39c-f2c484b45125"
  registry_auth_client_id = "0e296de7-c1e5-4bd8-b138-081cee0c9bc8"

  # Generic
  service_plan_sku_name = "B1"
  custom_domain = "sc3000.tst.recognize.hosting"
}
