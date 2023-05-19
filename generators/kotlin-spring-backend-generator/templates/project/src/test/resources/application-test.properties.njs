---
dependencies: [docker]
---
spring.config.location=classpath:application.properties

# Database
spring.datasource.url=${TESTS_DATABASE_URL:{{ dependencies.docker.tests_database_url }}}
spring.datasource.username=${TESTS_DATABASE_USERNAME:{{ dependencies.docker.tests_database_username }}}
spring.datasource.password=${TESTS_DATABASE_PASSWORD:{{ dependencies.docker.tests_database_password }}}
spring.datasource.hikari.maximum-pool-size=2
{% if security.type == "azure-ad" %}
# Active Directory
spring.cloud.azure.active-directory.credential.client-id=${AZURE_APP_ID:{{ security.identityProvider.properties.clientId }}}
spring.cloud.azure.active-directory.app-id-uri=api://${AZURE_APP_ID:{{ security.identityProvider.properties.clientId }}}
spring.cloud.azure.active-directory.profile.tenant-id=${AZURE_TENANT_ID:{{ security.identityProvider.properties.tenantId }}}
{% endif %}