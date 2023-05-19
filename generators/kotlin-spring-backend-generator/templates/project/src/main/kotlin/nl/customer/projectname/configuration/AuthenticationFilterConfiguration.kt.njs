package {{ variables.packageName }}.configuration

import com.azure.spring.cloud.autoconfigure.implementation.aad.configuration.properties.AadAuthenticationProperties
import com.azure.spring.cloud.autoconfigure.implementation.aad.filter.UserPrincipalManager
import com.azure.spring.cloud.autoconfigure.implementation.aad.security.properties.AadAuthorizationServerEndpoints
import com.nimbusds.jose.util.ResourceRetriever
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import {{ variables.packageName }}.security.AppAADAppRoleStatelessAuthenticationFilter

@Configuration
class AuthenticationFilterConfiguration {
{% if security.identityProvider.type == "azure-ad" %}
    @Bean
    fun aadAuthFilter(
        aadAuthenticationProperties: AadAuthenticationProperties,
        resourceRetriever: ResourceRetriever,
    ): AppAADAppRoleStatelessAuthenticationFilter {
        val explicitAudienceCheck = true

        return AppAADAppRoleStatelessAuthenticationFilter(
            UserPrincipalManager(
                AadAuthorizationServerEndpoints("", "common"),
                aadAuthenticationProperties,
                resourceRetriever,
                explicitAudienceCheck
            ),
        )
    }
{% endif %}
}
