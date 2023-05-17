{% set testDataEntity = testData.fetchTestDataForEntity(entity, 1) %}
{% import 'partials/sql.njs' as sql %}
-- Create sample data
INSERT INTO {{ entity.name | snakeCase }} (
    id,{% for field in entity.fields %}
    {{ field.name | snakeCase }},
    {%- endfor %}
    created_at,
    updated_at
)
VALUES (
    1,{% for field in entity.fields %}
    {{ sql.wrapValue(field.type, testDataEntity[field.name]) }},
    {%- endfor %}
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


SELECT setval('public.{{ entity.name | snakeCase }}_seq', 100);
