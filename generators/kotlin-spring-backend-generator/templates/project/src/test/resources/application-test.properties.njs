---
dependencies: [docker]
---
spring.config.location=classpath:application.properties

# Database
spring.datasource.url=${TESTS_DATABASE_URL:{{ dependencies.docker.tests_database_url }}}
spring.datasource.username=${TESTS_DATABASE_USERNAME:{{ dependencies.docker.tests_database_username }}}
spring.datasource.password=${TESTS_DATABASE_PASSWORD:{{ dependencies.docker.tests_database_password }}}
spring.datasource.hikari.maximum-pool-size=2
