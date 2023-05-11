terraform {
  source = "${get_repo_root()}//terraform/modules/custom/app_service_with_auth"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "service_plan" {
  config_path = "../../service_plan"

  mock_outputs = {
    id = "mock-app-service-plan-id"
  }
}

dependency "registry_fileshare" {
  config_path = "../../registry_fileshare"

  mock_outputs = {
    name = "mock-registry-fileshare-name"
  }
}

dependency "storage_account" {
  config_path = "../../storage_account"

  mock_outputs = {
      name = "mock-storage-account-name"
  }
}

inputs = {
  service_plan_id       = dependency.service_plan.outputs.id
  name                  = "app-${include.locals.client}-${include.locals.workload}-${include.locals.environment}-registry"
  docker_image          = get_env("DOCKER_IMAGE_REGISTRY")
  docker_image_tag      = get_env("DOCKER_IMAGE_TAG_REGISTRY")
  always_on             = true
  resource_group_name   = include.locals.env.resource_group_name
  auth_enabled = true
  require_authentication = true
  ad_auth_settings = {
    client_id = include.locals.env.registry_auth_client_id
    client_secret_setting_name = "AUTH_CLIENT_SECRET"
    tenant_auth_endpoint = "https://sts.windows.net/${include.locals.env.registry_auth_tenant_id}/v2.0"
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_URL"      = include.locals.globals.docker_registry_url
    "DOCKER_REGISTRY_SERVER_USERNAME" = get_env("DOCKER_USER", "")
    "DOCKER_REGISTRY_SERVER_PASSWORD" = get_env("DOCKER_PASSWORD", "")
    "WEBSITE_TIME_ZONE"                   = include.locals.globals.time_zone
    "WEBSITES_PORT"                       = "4873"
    "AUTH_CLIENT_SECRET"                  = get_env("REGISTRY_AUTH_CLIENT_SECRET", "")
    "DOCKER_REGISTRY_SERVER_URL" = "https://index.docker.io/v1"
  }

  storage_mount = {
    name         = "registry-storage",
    type         = "AzureFiles"
    account_name = dependency.storage_account.outputs.name
    share_name   = dependency.registry_fileshare.outputs.name
    access_key   = dependency.storage_account.outputs.primary_access_key
    mount_path   = "/verdaccio/storage"
  }
}
