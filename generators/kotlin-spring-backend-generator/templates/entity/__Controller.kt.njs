---
id: controller
dependencies: [dto, entity, repository]
constants:
    url: '/api/v1/{{ entity.name | urlCase }}'
---
{% macro rolesAllowed(roles) -%}
{% if roles|length > 0 -%}
{%- set comma = joiner(', ') -%}
@RolesAllowed(
{%- for role in roles -%}
  {{ comma() }}Roles.{{ role | constantCase }}
{%- endfor -%}
)
{%- endif %}
{%- endmacro %}
package {{ variables.packageName }}.controller

import {{ dependencies.entity.import }}
import {{ dependencies.dto.import }}
import {{ dependencies.repository.import }}
import {{ variables.packageName }}.security.Roles
import org.springdoc.core.annotations.ParameterObject
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.security.RolesAllowed

@RestController
@RequestMapping("{{ constants.url }}", produces = ["application/json"])
{{ rolesAllowed(entity.operations.entity.roles) }}
class {{ dependencies.entity.name }}Controller(
    private val {{ dependencies.repository.variableName }}: {{ dependencies.repository.name }},
) {
{% if entity.operations.read.enabled-%}
    {{ rolesAllowed(entity.operations.read.roles) }}
    @GetMapping("")
    fun list(
        @ParameterObject @PageableDefault(size = 20, sort = ["id"]) pageRequest: Pageable,
    ) = {{ dependencies.entity.variableName }}Repository.findAll(pageRequest)
{% endif %}
{% if entity.operations.create.enabled -%}
    {{ rolesAllowed(entity.operations.create.roles) }}
    @PostMapping("")
    fun create(@RequestBody input: {{ dependencies.dto.name }}) = {{ dependencies.repository.variableName }}.save(
        {{ dependencies.entity.name }}({% for field in entity.fields -%}
            {% if field.required == true %}
            {{ field.name }} = input.{{ field.name }},
            {%- endif -%}
          {%- endfor %}
        ).apply { applyDTO(input) }
    )
{% endif %}
{% if entity.operations.update.enabled -%}
    {{ rolesAllowed(entity.operations.update.roles) }}
    @PutMapping("{entity}")
    fun update(@PathVariable entity: {{ dependencies.entity.name }}, @RequestBody input: {{ dependencies.dto.name }})
        = {{ dependencies.repository.variableName }}.save(entity.apply { applyDTO(input) })
{% endif %}
{% if entity.operations.delete.enabled -%}
    {{ rolesAllowed(entity.operations.delete.roles) }}
    @DeleteMapping("{entity}")
    fun delete(@PathVariable entity: {{ dependencies.entity.name }}) = {{ dependencies.repository.variableName }}.delete(entity)
{% endif %}
{% if entity.operations.read.enabled -%}
    {{ rolesAllowed(entity.operations.read.roles) }}
    @GetMapping("{entity}")
    fun detail(@PathVariable entity: {{ dependencies.entity.name }}) = entity
{% endif %}
}
