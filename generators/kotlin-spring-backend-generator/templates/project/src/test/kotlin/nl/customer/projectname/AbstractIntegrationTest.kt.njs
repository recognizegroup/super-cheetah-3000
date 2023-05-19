---
id: integrationtest
dependencies: [dbcleaner]
---
package {{ variables.packageName }}

import {{ dependencies.dbcleaner.import }}
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.ImportAutoConfiguration
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc

@ExtendWith(DbCleanerExtension::class)
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ImportAutoConfiguration(classes = [TestConfiguration::class])
@TestPropertySource(locations = ["classpath:application-test.properties"])
abstract class AbstractIntegrationTest {
    @Autowired
    protected lateinit var mockMvc: MockMvc
}