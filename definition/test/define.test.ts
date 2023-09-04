import {expect} from 'chai'
import {
  azureIdentityProvider,
  configureInfrastructure,
  configureSecurity,
  createDefinition,
  createEntity,
  createProject,
} from '../src'
import {useGenerator} from '../src/define'
import {GeneratorBuilder} from '../src/generator-builder'
import {DefinitionBuilder} from '../src/definition-builder'
import {ProjectBuilder} from '../src/project-builder'
import {EntityBuilder} from '../src/entity-builder'
import {SecurityConfigurationBuilder} from '../src/security-configuration-builder'
import {AzureIdentityProviderConfigurationBuilder} from '../src/azure-identity-provider-configuration-builder'
import {InfrastructureBuilder} from '../src/infrastructure-builder'

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
    const packageLocation = 'my-package'
    const generatorBuilder = useGenerator(packageLocation)
    expect(generatorBuilder).to.be.an.instanceOf(GeneratorBuilder)
    expect(generatorBuilder.packageLocation).to.equal(packageLocation)
    expect(generatorBuilder.version).to.equal('latest')
  })

  it('useGenerator should create an instance of GeneratorBuilder with a version constraint', () => {
    const packageLocation = 'my-package'
    const generatorBuilder = useGenerator(packageLocation, '^1.0')
    expect(generatorBuilder).to.be.an.instanceOf(GeneratorBuilder)
    expect(generatorBuilder.packageLocation).to.equal(packageLocation)
    expect(generatorBuilder.version).to.equal('^1.0')
  })

  it('configureSecurity should create an instance of SecurityConfigurationBuilder', () => {
    const securityConfigurationBuilder = configureSecurity()
    expect(securityConfigurationBuilder).to.be.an.instanceOf(SecurityConfigurationBuilder)
  })

  it('configureInfrastructure should create an instance of InfrastructureBuilder', () => {
    const infrastructureBuilder = configureInfrastructure()
    expect(infrastructureBuilder).to.be.an.instanceOf(InfrastructureBuilder)
  })

  it('azureIdentityProvider should create an instance of AzureIdentityProviderConfigurationBuilder', () => {
    const azureIdentityProviderConfigurationBuilder = azureIdentityProvider()
    expect(azureIdentityProviderConfigurationBuilder).to.be.an.instanceOf(AzureIdentityProviderConfigurationBuilder)
  })
})
