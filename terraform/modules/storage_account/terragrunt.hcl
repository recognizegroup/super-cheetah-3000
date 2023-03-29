terraform {
  source = "git::https://github.com/recognizegroup/terraform.git//modules/azure/storage_account_public?ref=v3.0.0-beta.17"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

inputs = {
  location = include.locals.globals.location
  resource_group_name = include.locals.env.resource_group_name
  name = "strecognizsuperch${include.locals.environment}"
}
