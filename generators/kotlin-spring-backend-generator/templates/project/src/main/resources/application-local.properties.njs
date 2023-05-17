---
dependencies: [docker]
---
# Database
spring.datasource.url={{ dependencies.docker.database_url }}
spring.datasource.username={{ dependencies.docker.database_username }}
spring.datasource.password={{ dependencies.docker.database_password }}

# API documentation
springdoc.api-docs.enabled=true
