{% macro wrapValue(type, value) -%}
  {% if type == 'string' or type == 'text' -%}
    '{{ value }}'
  {%- else -%}
    {{ value }}
  {%- endif %}
{%- endmacro %}

{% macro testDataInsert(entity, testDataEntity) -%}
INSERT INTO {{ entity.name | snakeCase }} (
    id,{% for field in entity.fields -%}
    {% if not field.type.target %}
    {{ field.name | snakeCase }},
    {%- else %}
    {{ field.name | snakeCase }}_id,
    {%- endif %}
    {%- endfor %}
    created_at,
    updated_at
)
VALUES (
    {{ testDataEntity.id }},{% for field in entity.fields -%}
    {% if not field.type.target %}
    {{ wrapValue(field.type, testDataEntity[field.name]) }},
    {%- else %}
    {{ testDataEntity[field.name].id }},
    {%- endif %}
    {%- endfor %}
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

SELECT setval('public.{{ entity.name | snakeCase }}_seq', 1000000);
{%- endmacro %}
