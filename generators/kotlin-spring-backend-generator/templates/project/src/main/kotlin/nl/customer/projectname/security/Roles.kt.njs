package {{ variables.packageName }}.security

object Roles {
  {% for role in security.roles -%}
  const val {{ role | constantCase }} = "{{ role | constantCase }}"
  {% endfor %}
}
