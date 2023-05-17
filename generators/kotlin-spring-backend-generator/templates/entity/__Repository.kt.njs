---
id: repository
constants:
    name: '{{ entity.name | pascalCase }}Repository'
    variableName: '{{ entity.name | camelCase }}Repository'
    import: '{{ variables.packageName }}.repository.{{ entity.name | pascalCase }}Repository'
dependencies: [entity]
---
package {{ variables.packageName }}.repository

import {{ dependencies.entity.import }}
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface {{ constants.name }} : JpaRepository<{{ dependencies.entity.name }}, Long>
