package {{ variables.packageName }}.security

{% if security.identityProvider.type == "azure-ad" -%}
import com.azure.spring.cloud.autoconfigure.implementation.aad.filter.AadAppRoleStatelessAuthenticationFilter
import com.azure.spring.cloud.autoconfigure.implementation.aad.filter.UserPrincipal
import com.azure.spring.cloud.autoconfigure.implementation.aad.filter.UserPrincipalManager
import org.springframework.security.core.authority.SimpleGrantedAuthority

class AppAADAppRoleStatelessAuthenticationFilter(principalManager: UserPrincipalManager?) : AadAppRoleStatelessAuthenticationFilter(principalManager) {
    override fun toSimpleGrantedAuthoritySet(userPrincipal: UserPrincipal?): MutableSet<SimpleGrantedAuthority> {
        return userPrincipal?.roles
                ?.map { s: String -> SimpleGrantedAuthority(s) }
                ?.toMutableSet() ?: mutableSetOf()
    }
}
{% endif %}
