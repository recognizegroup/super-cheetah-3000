{% macro wrapValue(type, value) -%}
  {% if type == 'string' or type == 'text' -%}
    '{{ value }}'
  {%- else -%}
    {{ value }}
  {%- endif %}
{%- endmacro %}
