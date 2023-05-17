---
id: entity
constants:
    name: '{{ entity.name }}'
    variableName: '{{ entity.name | camelCase }}'
    import: '{{ variables.packageName }}.entity.{{ entity.name | pascalCase }}'
dependencies: [dto]
---
{% import 'partials/kotlin.njs' as kotlin %}
package {{ variables.packageName }}.entity

import {{ dependencies.dto.import }}
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.ZonedDateTime

@Entity
class {{ constants.name }}(
    {% for field in entity.fields -%}
      {%- if field.required == true -%}
        {{ kotlin.entityField(field, true) }}
      {%- endif %}
    {%- endfor %}
) {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Long? = null
{% for field in entity.fields -%}
  {%- if field.required != true -%}
  {{ kotlin.entityField(field, false) }}
  {%- endif %}
{%- endfor %}
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()")
    @CreationTimestamp
    var createdAt: ZonedDateTime = ZonedDateTime.now()

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()")
    @UpdateTimestamp
    var updatedAt: ZonedDateTime = ZonedDateTime.now()

    fun applyDTO(dto: {{ dependencies.dto.name }}) {
        {% for field in entity.fields -%}
        this.{{ field.name }} = dto.{{ field.name }}
        {% endfor %}
    }
}
