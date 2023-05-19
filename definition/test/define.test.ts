import {expect} from 'chai'
import {azureIdentityProvider, configureSecurity, createDefinition, createEntity, createProject} from '../src'
import {useGenerator} from '../src/define'
import {GeneratorBuilder} from '../src/generator-builder'
import {DefinitionBuilder} from '../src/definition-builder'
import {ProjectBuilder} from '../src/project-builder'
import {EntityBuilder} from '../src/entity-builder'
import {SecurityConfigurationBuilder} from '../src/security-configuration-builder'
import {AzureIdentityProviderConfigurationBuilder} from '../src/azure-identity-provider-configuration-builder'

describe('define', () => {
  it('createEntity should create an instance of EntityBuilder', () => {
    const entityBuilder = createEntity('User')
    expect(entityBuilder).to.be.an.instanceOf(EntityBuilder)
    expect(entityBuilder.name).to.equal('User')
  })

  it('createProject should create an instance of ProjectBuilder', () => {
    const projectBuilder = createProject()
    expect(projectBuilder).to.be.an.instanceOf(ProjectBuilder)
  })

  it('createDefinition should create an instance of DefinitionBuilder', () => {
    const definitionBuilder = createDefinition()
    expect(definitionBuilder).to.be.an.instanceOf(DefinitionBuilder)
  })

  it('useGenerator should create an instance of GeneratorBuilder', () => {
    const packageName = 'my-package'
    const generatorBuilder = useGenerator(packageName)
    expect(generatorBuilder).to.be.an.instanceOf(GeneratorBuilder)
    expect(generatorBuilder.packageName).to.equal(packageName)
  })

  it('configureSecurity should create an instance of SecurityConfigurationBuilder', () => {
    const securityConfigurationBuilder = configureSecurity()
    expect(securityConfigurationBuilder).to.be.an.instanceOf(SecurityConfigurationBuilder)
  })

  it('azureIdentityProvider should create an instance of AzureIdentityProviderConfigurationBuilder', () => {
    const azureIdentityProviderConfigurationBuilder = azureIdentityProvider()
    expect(azureIdentityProviderConfigurationBuilder).to.be.an.instanceOf(AzureIdentityProviderConfigurationBuilder)
  })
})
