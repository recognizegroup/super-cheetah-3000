import {expect} from 'chai'
import {DefinitionBuilder} from '../src/definition-builder'
import {Entity, IdentityProviderType, Project, ProjectGenerator} from '@recognizebv/sc3000-generator'

describe('definition builder', () => {
  let definitionBuilder: DefinitionBuilder
  const projectMock: Project = {
    client: 'Acme Corp',
    name: 'My Project',
    team: 'Development Team',
  }
  const entityMock: Entity = {
    name: 'User',
    fields: [],
  }
  const generatorMock: ProjectGenerator = {
    packageLocation: 'My Generator',
    inputs: {},
    version: '^1.0.0',
  }
  const securityConfigMock = {
    roles: ['admin', 'user'],
    identityProvider: {
      type: IdentityProviderType.AZURE_AD,
      properties: {
        clientId: '1234',
        tenantId: '5678',
      },
    },
  }

  beforeEach(() => {
    definitionBuilder = new DefinitionBuilder()
  })

  it('should set the project', () => {
    const result = definitionBuilder.forProject(projectMock)

    expect(result).to.equal(definitionBuilder)
    expect(definitionBuilder.project).to.equal(projectMock)
  })

  it('should add an entity', () => {
    const result = definitionBuilder.addEntity(entityMock)

    expect(result).to.equal(definitionBuilder)
    expect(definitionBuilder.entities).to.deep.equal([entityMock])
  })

  it('should add a generator', () => {
    const result = definitionBuilder.withGenerator(generatorMock)

    expect(result).to.equal(definitionBuilder)
    expect(definitionBuilder.generators).to.deep.equal([generatorMock])
  })

  it('should set the working directory', () => {
    const workingDirectory = '/path/to/project'
    definitionBuilder.workingDirectory = workingDirectory

    expect(definitionBuilder.workingDirectory).to.equal(workingDirectory)
  })

  it('should add a security configuration', () => {
    const result = definitionBuilder.withSecurityConfiguration(securityConfigMock)

    expect(result).to.equal(definitionBuilder)
    expect(definitionBuilder.securityConfiguration).to.deep.equal(securityConfigMock)
  })
})
