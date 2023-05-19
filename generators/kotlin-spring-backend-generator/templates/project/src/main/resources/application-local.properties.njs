---
dependencies: [docker]
---
# Database
spring.datasource.url={{ dependencies.docker.database_url }}
spring.datasource.username={{ dependencies.docker.database_username }}
spring.datasource.password={{ dependencies.docker.database_password }}

# API documentation
springdoc.api-docs.enabled=true
{% if security.identityProvider.type == "azure-ad" %}
# Active Directory
spring.cloud.azure.active-directory.credential.client-id=${AZURE_APP_ID:{{ security.identityProvider.properties.clientId }}}
spring.cloud.azure.active-directory.app-id-uri=api://${AZURE_APP_ID:{{ security.identityProvider.properties.clientId }}}
spring.cloud.azure.active-directory.profile.tenant-id=${AZURE_TENANT_ID:{{ security.identityProvider.properties.tenantId }}}
{% endif %}
