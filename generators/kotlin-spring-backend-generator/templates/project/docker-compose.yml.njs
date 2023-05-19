---
id: docker
constants:
    database_url: 'jdbc:postgresql://localhost:5432/{{ project.name }}'
    database_username: '{{ project.name }}'
    database_password: '{{ project.name }}'

    tests_database_url: 'jdbc:postgresql://localhost:15432/{{ project.name }}_tests'
    tests_database_username: '{{ project.name }}_tests'
    tests_database_password: '{{ project.name }}_tests'
---
version: '3.9'

services:
  postgres:
    image: "postgres:14-alpine"
    environment:
    - "POSTGRES_DB={{ project.name }}"
    - "POSTGRES_USER={{ project.name }}"
    - "POSTGRES_PASSWORD={{ project.name }}"
    volumes:
    - "pg01:/var/lib/postgresql"
    ports:
    - "5432:5432"

  postgres_tests:
    image: "postgres:14-alpine"
    environment:
      - "POSTGRES_DB={{ project.name }}_tests"
      - "POSTGRES_USER={{ project.name }}_tests"
      - "POSTGRES_PASSWORD={{ project.name }}_tests"
    volumes:
      - "pg02:/var/lib/postgresql/data"
    ports:
      - "15432:5432"

volumes:
  pg01: {}
  pg02: {}