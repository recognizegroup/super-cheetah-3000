---
dependencies: [docker]
---
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.0.2"
	id("io.spring.dependency-management") version "1.1.0"
    id("org.liquibase.gradle") version "2.1.1"
	kotlin("plugin.jpa") version "1.7.22"
	kotlin("jvm") version "1.7.22"
	kotlin("plugin.spring") version "1.7.22"
}

group = "nl.{{ project.client }}"
version = "1.0.0"
java.sourceCompatibility = JavaVersion.VERSION_17

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.liquibase:liquibase-core")
	implementation("org.postgresql:postgresql:42.2.27")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.hibernate:hibernate-validator:6.2.0.Final")

	developmentOnly("org.springframework.boot:spring-boot-devtools")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")

	liquibaseRuntime("info.picocli:picocli:4.6.3")
    liquibaseRuntime("org.liquibase:liquibase-core")
    liquibaseRuntime("org.postgresql:postgresql")
    liquibaseRuntime("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    liquibaseRuntime("org.liquibase.ext:liquibase-hibernate6:4.19.0")
    liquibaseRuntime("org.springframework.boot:spring-boot-starter-data-jpa")
    liquibaseRuntime(sourceSets.getByName("main").output)
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

liquibase {
    activities.register("main") {
        arguments = mapOf(
            "changeLogFile" to "src/main/resources/db/changelog/changes.yaml",
            "url" to "{{ dependencies.docker.database_url }}",
            "username" to "{{ dependencies.docker.database_username }}",
            "password" to "{{ dependencies.docker.database_password }}",
            "referenceUrl" to "hibernate:spring:{{ variables.packageName }}" +
                "?dialect=org.hibernate.dialect.PostgreSQL95Dialect" +
				"&hibernate.physical_naming_strategy=org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy" +
                "&hibernate.implicit_naming_strategy=org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy",
            "excludeObjects" to "spatial_ref_sys,raster_overviews,raster_columns,geometry_columns,geography_columns,shedlock,spring_session,spring_session_attributes"
        )
    }
    runList = "main"
}

tasks.diffChangeLog {
	dependsOn("compileKotlin")
}
