{% set testDataEntity = testData.fetchTestDataForEntity(entity, 1) %}
{% set testDataEntityCreate = testData.fetchTestDataForEntity(entity, 2) %}
{% set testDataEntityUpdate = testData.fetchTestDataForEntity(entity, 3) %}
{% import 'partials/sql.njs' as sql %}
-- Create sample data
{% for related in (entity | findRelatedEntities) %}
{{ sql.testDataInsert(related.entity, testData.findTestDataForPath(testDataEntity, related.path)) }}
{{ sql.testDataInsert(related.entity, testData.findTestDataForPath(testDataEntityCreate, related.path)) }}
{{ sql.testDataInsert(related.entity, testData.findTestDataForPath(testDataEntityUpdate, related.path)) }}
{% endfor %}

{{ sql.testDataInsert(entity, testDataEntity) }}
