{% macro dataType(type, required = false) -%}
  {% if type == 'string' or type == 'text' -%}
    String
  {%- elif type == 'integer' -%}
    Int
  {%- elif type == 'boolean' -%}
    Boolean
  {%- else -%}
    {{ type.target.name | pascalCase }}
  {%- endif -%}{% if not required %}?{% endif %}
{%- endmacro %}

{% macro entityField(field, constructor) -%}
  {% if field.type.parity == 'manyToOne' %}
    @ManyToOne
  {%- elif field.type.parity == 'oneToMany' %}
    @OneToMany(mappedBy = "{{ entity.name | camelCase }}")
  {%- elif field.type.parity == 'manyToMany' %}
    @ManyToMany
  {%- elif field.type.parity == 'oneToOne' %}
    @OneToOne
  {%- else %}
    @Column{% if not field.required %}(nullable = true){% endif %}
  {%- endif %}
    var {{ field.name | camelCase }}: {{ dataType(field.type, field.required) }}{% if not field.required %} = null{% endif %}{% if constructor %},{% endif %}
{% endmacro %}

{% macro wrapValue(type, value) -%}
  {% if type == 'string' or type == 'text' -%}
    "{{ value }}"
  {%- else -%}
    {{ value }}
  {%- endif %}
{%- endmacro %}
