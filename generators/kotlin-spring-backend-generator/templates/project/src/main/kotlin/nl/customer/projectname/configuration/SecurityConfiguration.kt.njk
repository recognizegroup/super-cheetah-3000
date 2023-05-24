package {{ variables.packageName }}.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter
import org.springframework.security.web.header.writers.StaticHeadersWriter
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter
{% if security.identityProvider.type == "azure-ad" -%}
import {{ variables.packageName }}.security.AppAADAppRoleStatelessAuthenticationFilter
{%- endif %}

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, jsr250Enabled = true)
@Configuration
class SecurityConfiguration(
    {% if security.identityProvider.type == "azure-ad" -%}
      private val aadAuthFilter: AppAADAppRoleStatelessAuthenticationFilter,
    {%- endif %}
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors()
        http.httpBasic()

{% if security.identityProvider.type != "none" %}
        http
            .authorizeHttpRequests()
            .requestMatchers(HttpMethod.GET, "/docs").permitAll()
            .requestMatchers("/api/v1/**").authenticated()
{% endif %}

        http
            .csrf().disable()

        http
            .headers()
            .frameOptions()
            .sameOrigin()

        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        http
            .headers()
            .frameOptions().sameOrigin()
            .httpStrictTransportSecurity()
            .and().referrerPolicy().policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
            .and()
            .contentTypeOptions()

{% if security.identityProvider.type == "azure-ad" %}
        http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
{% endif %}

        return http.build()
    }
}
