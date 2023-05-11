import {expect} from 'chai'
import {createDefinition, createEntity, createProject} from '../src'
import {useGenerator} from '../src/define'
import {GeneratorBuilder} from '../src/generator-builder'
import {DefinitionBuilder} from '../src/definition-builder'
import {ProjectBuilder} from '../src/project-builder'
import {EntityBuilder} from '../src/entity-builder'

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
})
