import {EntityBuilder} from './entity-builder'
import {ProjectBuilder} from './project-builder'
import {GeneratorBuilder} from './generator-builder'
import {DefinitionBuilder} from './definition-builder'
import {SecurityConfigurationBuilder} from './security-configuration-builder'
import {AzureIdentityProviderConfigurationBuilder} from './azure-identity-provider-configuration-builder'

export const createEntity = (name: string): EntityBuilder => {
  return new EntityBuilder(name)
}

export const createProject = (): ProjectBuilder => {
  return new ProjectBuilder()
}

export const createDefinition = (): DefinitionBuilder => {
  return new DefinitionBuilder()
}

export const useGenerator = (packageName: string): GeneratorBuilder => {
  return new GeneratorBuilder(packageName)
}

export const configureSecurity = (): SecurityConfigurationBuilder => {
  return new SecurityConfigurationBuilder()
}

export const azureIdentityProvider = (): AzureIdentityProviderConfigurationBuilder => {
  return new AzureIdentityProviderConfigurationBuilder()
}
