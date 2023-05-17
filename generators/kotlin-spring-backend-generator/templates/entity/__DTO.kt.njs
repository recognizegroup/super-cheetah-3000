---
id: dto
constants:
    name: '{{ entity.name | pascalCase }}DTO'
    import: '{{ variables.packageName }}.model.{{ entity.name | pascalCase }}DTO'
---
{% import 'partials/kotlin.njs' as kotlin %}
package {{ variables.packageName }}.model

import {{ variables.packageName }}.entity.*

data class {{ constants.name }}({% for field in entity.fields %}
    val {{ field.name | camelCase }}: {{ kotlin.dataType(field.type, field.required) }},
    {%- endfor %}
)
