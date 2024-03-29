import {EntityBuilder} from './entity-builder'
import {ProjectBuilder} from './project-builder'
import {GeneratorBuilder} from './generator-builder'
import {DefinitionBuilder} from './definition-builder'
import {SecurityConfigurationBuilder} from './security-configuration-builder'
import {AzureIdentityProviderConfigurationBuilder} from './azure-identity-provider-configuration-builder'
import {InfrastructureBuilder} from './infrastructure-builder'

export const createEntity = (name: string): EntityBuilder => {
  return new EntityBuilder(name)
}

export const createProject = (): ProjectBuilder => {
  return new ProjectBuilder()
}

export const createDefinition = (): DefinitionBuilder => {
  return new DefinitionBuilder()
}

export const useGenerator = (packageLocation: string, version = 'latest'): GeneratorBuilder => {
  return new GeneratorBuilder(packageLocation, version)
}

export const configureSecurity = (): SecurityConfigurationBuilder => {
  return new SecurityConfigurationBuilder()
}

export const azureIdentityProvider = (): AzureIdentityProviderConfigurationBuilder => {
  return new AzureIdentityProviderConfigurationBuilder()
}

export const configureInfrastructure = (): InfrastructureBuilder => {
  return new InfrastructureBuilder()
}
