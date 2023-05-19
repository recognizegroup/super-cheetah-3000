import {
  Entity,
  Project,
  ProjectDefinition,
  ProjectGenerator,
  SecurityConfiguration,
} from '@recognizebv/sc3000-generator'

export class DefinitionBuilder implements ProjectDefinition {
  public project!: Project
  public entities: Entity[] = []
  public generators: ProjectGenerator[] = []
  public workingDirectory = process.cwd()
  public securityConfiguration?: SecurityConfiguration

  public forProject(project: Project): DefinitionBuilder {
    this.project = project
    return this
  }

  public addEntity(entity: Entity): DefinitionBuilder {
    this.entities.push(entity)
    return this
  }

  public withGenerator(generator: ProjectGenerator): DefinitionBuilder {
    this.generators.push(generator)
    return this
  }

  public withSecurityConfiguration(securityConfiguration: SecurityConfiguration): DefinitionBuilder {
    this.securityConfiguration = securityConfiguration
    return this
  }
}
