# Database
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=none

# API documentation
springdoc.api-docs.path=/docs/openapi.json
springdoc.api-docs.enabled=${API_DOCS_ENABLED:false}
springdoc.swagger-ui.path=/docs/swagger

# Serialization
spring.jackson.serialization.WRITE_DATES_AS_TIMESTAMPS=false
spring.mvc.converters.preferred-json-mapper=jackson
spring.jackson.date-format=yyyy-MM-dd'T'HH:mm:ss.SSSZ

# General
spring.main.allow-bean-definition-overriding=true
server.error.whitelabel.enabled=false
{% if security.identityProvider.type == "azure-ad" %}
# Active Directory
spring.cloud.azure.active-directory.enabled=true
spring.cloud.azure.active-directory.session-stateless=true
spring.cloud.azure.active-directory.credential.client-id=${AZURE_APP_ID}
spring.cloud.azure.active-directory.app-id-uri=api://${AZURE_APP_ID}
spring.cloud.azure.active-directory.profile.tenant-id=${AZURE_TENANT_ID}
{% endif %}
