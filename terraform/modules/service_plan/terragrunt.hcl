terraform {
  source = "git::https://github.com/recognizegroup/terraform.git//modules/azure/service_plan?ref=${include.locals.version}"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

inputs = {
  name                = "asp-${include.locals.client}-${include.locals.workload}-${include.locals.environment}"
  sku_name            = include.locals.env.service_plan_sku_name
  resource_group_name = include.locals.env.resource_group_name
  os_type             = "Linux"
}
