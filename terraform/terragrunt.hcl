locals {
  env         = read_terragrunt_config("${get_parent_terragrunt_dir()}/environments/${get_env("ENVIRONMENT", "tst")}/env.hcl").locals
  globals     = read_terragrunt_config("${get_parent_terragrunt_dir()}/globals.hcl").locals
  module      = replace(path_relative_to_include(), "modules/", "")
  environment = get_env("ENVIRONMENT", "tst")
  client      = "recognize"
  workload    = "super-cheetah-3000"
  version     = "v3.0.0"
}

inputs = {
  location = local.globals.location
}

remote_state {
  backend = "azurerm"
  config = {
    key                  = "${local.module}/terraform.tfstate"
    container_name       = "tfstate"
    resource_group_name  = "rg-recognize-super-cheetah-3000-terraform"
    storage_account_name = "strecognizsuperchtf${local.environment}"
  }
}
