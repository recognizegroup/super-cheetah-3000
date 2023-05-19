---
id: controller-test
dependencies: [entity, controller]
---
{% import 'partials/kotlin.njs' as kotlin %}
package {{ variables.packageName }}.controller

import {{ dependencies.entity.import }}
import {{ variables.packageName }}.AbstractIntegrationTest
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.Test
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

internal class {{ dependencies.entity.name }}ControllerTest : AbstractIntegrationTest() {
{% set baseTestData = testData.fetchTestDataForEntity(entity, 1) %}
{% if entity.operations.read %}
    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Lists a set of {{ entity.name }} items`() {
        mockMvc
            .perform(get("{{ dependencies.controller.url }}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.content", hasSize<{{ dependencies.entity.name }}>(1)))
            {% for flattened in (entity | flattenEntityFieldsForTestResults) -%}
            .andExpect(jsonPath("$.content[0].{{ flattened.name }}", equalTo({{ kotlin.wrapValue(flattened.field.type, testData.findTestDataForPath(baseTestData, flattened.name)) }})))
            {% endfor %}
    }
{% endif %}
{% if entity.operations.read %}
    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Retrieve a single {{ entity.name }}`() {
        mockMvc
            .perform(get("{{ dependencies.controller.url }}/{{ baseTestData.id }}"))
            .andExpect(status().isOk)
            {% for flattened in (entity | flattenEntityFieldsForTestResults) -%}
            .andExpect(jsonPath("$.{{ flattened.name }}", equalTo({{ kotlin.wrapValue(flattened.field.type, testData.findTestDataForPath(baseTestData, flattened.name)) }})))
            {% endfor %}
    }

    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Throws a not-found error when a {{ entity.name }} does not exist`() {
        mockMvc
            .perform(get("{{ dependencies.controller.url }}/0"))
            .andExpect(status().isNotFound)
    }
{% endif %}
{% if entity.operations.create %}
    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Create a {{ entity.name }}`() {
        {% set createEntityTestData = testData.fetchTestDataForEntity(entity, 2) %}
        mockMvc
            .perform(
                post("{{ dependencies.controller.url }}")
                    .contentType("application/json")
                    .content(
                        """
{{ testData.fetchTestDataForEntity(entity, 2) | json | safe }}
                        """.trimIndent()
                    )
            )
            .andExpect(status().isOk)
            {% for flattened in (entity | flattenEntityFieldsForTestResults) -%}
            .andExpect(jsonPath("$.{{ flattened.name }}", equalTo({{ kotlin.wrapValue(flattened.field.type, testData.findTestDataForPath(createEntityTestData, flattened.name)) }})))
            {% endfor %}
    }
{% endif %}
{% if entity.operations.update %}
    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Updates a {{ entity.name }}`() {
        {% set updateEntityTestData = testData.fetchTestDataForEntity(entity, 3)  %}
        mockMvc
            .perform(
                put("{{ dependencies.controller.url }}/{{ baseTestData.id }}")
                    .contentType("application/json")
                    .content(
                        """
{{ updateEntityTestData | json | safe }}
                        """.trimIndent()
                    )
            )
            .andExpect(status().isOk)
            {% for flattened in (entity | flattenEntityFieldsForTestResults) -%}
            .andExpect(jsonPath("$.{{ flattened.name }}", equalTo({{ kotlin.wrapValue(flattened.field.type, testData.findTestDataForPath(updateEntityTestData, flattened.name)) }})))
            {% endfor %}
    }
{% endif %}
{% if entity.operations.delete %}
    @Test
    @Sql(scripts = ["classpath:fixtures/{{ entity.name | kebabCase }}.sql"])
    fun `Deletes a {{ entity.name }}`() {
        mockMvc
            .perform(
                delete("{{ dependencies.controller.url }}/{{ baseTestData.id }}")
            )
            .andExpect(status().isOk)
    }
{% endif %}
}
