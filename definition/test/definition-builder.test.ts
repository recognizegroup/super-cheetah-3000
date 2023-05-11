import {expect} from 'chai'
import {DefinitionBuilder} from '../src/definition-builder'
import {Entity, Project, ProjectGenerator} from '@recognizebv/sc3000-generator'

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
    packageName: 'My Generator',
    inputs: {},
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
})
