terraform {
  required_version = ">=1.1.2"

  required_providers {
    azurerm = "=3.35.0"
  }

  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_app_service_custom_hostname_binding" "custom_hostname" {
  app_service_name    = var.app_service_name
  hostname            = var.hostname
  resource_group_name = var.resource_group_name
}

resource "azurerm_app_service_managed_certificate" "custom_hostname_certificate" {
  custom_hostname_binding_id = azurerm_app_service_custom_hostname_binding.custom_hostname.id
}

resource "azurerm_app_service_certificate_binding" "custom_hostname_certificate_binding" {
  hostname_binding_id = azurerm_app_service_custom_hostname_binding.custom_hostname.id
  certificate_id      = azurerm_app_service_managed_certificate.custom_hostname_certificate.id
  ssl_state           = "SniEnabled"
}
