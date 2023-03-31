terraform {
  source = "${get_repo_root()}//terraform/modules/custom/hostname"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "app_service" {
  config_path = "../../app_services/registry"
  mock_outputs = {
    name = "registry"
  }
}

inputs = {
  name                = "chb-${include.locals.client}-${include.locals.workload}-${include.locals.environment}-registry"
  app_service_name    = dependency.app_service.outputs.name
  hostname            = include.locals.env.custom_domain
  resource_group_name = include.locals.env.resource_group_name
}
