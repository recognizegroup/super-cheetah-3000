import {expect} from 'chai'
import {
  EjsTemplateEngine,
  EntityContext,
  FakerTestDataManager,
  LocalFilesystem,
  Project,
  ProjectContext,
} from '../../src'

describe('context', () => {
  const project: Project = {
    client: 'recognize',
    name: 'bezoekersapp',
    team: 'team-technology',
  }

  const sampleRoot = '/tmp/test'

  it('should be able construct a project context and build variables', () => {
    const filesystem = new LocalFilesystem(sampleRoot)
    const templateEngine = new EjsTemplateEngine(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new ProjectContext({
      project,
      filesystem,
      templateEngine,
      testData,
    })

    expect(context.project).to.equal(project)
    expect(context.filesystem).to.equal(filesystem)
    expect(context.templateEngine).to.equal(templateEngine)
    expect(context.testData).to.equal(testData)

    const variables = context.buildVariables()
    expect(variables).to.have.property('project')
    expect(variables).to.have.property('testData')
  })

  it('should be able construct an entity context and build variables', () => {
    const entity = {
      name: 'Project',
      fields: [],
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const templateEngine = new EjsTemplateEngine(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      templateEngine,
      testData,
      entity,
    })

    expect(context.project).to.equal(project)
    expect(context.filesystem).to.equal(filesystem)
    expect(context.templateEngine).to.equal(templateEngine)
    expect(context.testData).to.equal(testData)
    expect(context.entity).to.equal(entity)

    const variables = context.buildVariables()
    expect(variables).to.have.property('project')
    expect(variables).to.have.property('testData')
    expect(variables).to.have.property('entity')
    expect(variables.entity).to.equal(entity)
  })

  it('should enable all operations if none provided', () => {
    const entity = {
      name: 'Project',
      fields: [],
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const templateEngine = new EjsTemplateEngine(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      templateEngine,
      testData,
      entity,
    })

    expect(context.entity.operations).not.to.be.undefined
    expect(context.entity.operations?.create).to.be.true
    expect(context.entity.operations?.read).to.be.true
    expect(context.entity.operations?.update).to.be.true
    expect(context.entity.operations?.delete).to.be.true
  })

  it('should merge operations if explicitely defined', () => {
    const entity = {
      name: 'Project',
      fields: [],
      operations: {
        read: false,
      },
    }

    const filesystem = new LocalFilesystem(sampleRoot)
    const templateEngine = new EjsTemplateEngine(sampleRoot)
    const testData = new FakerTestDataManager()

    const context = new EntityContext({
      project,
      filesystem,
      templateEngine,
      testData,
      entity,
    })

    expect(context.entity.operations).not.to.be.undefined
    expect(context.entity.operations?.create).to.be.true
    expect(context.entity.operations?.read).to.be.false
    expect(context.entity.operations?.update).to.be.true
    expect(context.entity.operations?.delete).to.be.true
  })
})
