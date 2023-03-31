terraform {
  source = "git::https://github.com/recognizegroup/terraform.git//modules/azure/storage_share?ref=${include.locals.version}"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "storage_account" {
  config_path = "../storage_account"
  mock_outputs = {
    name = "mock-storage-account"
  }
}

inputs = {
  name = "registry-share"
  storage_account_name = dependency.storage_account.outputs.name
  quota = 2
}
